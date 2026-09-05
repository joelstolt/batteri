import {beforeEach,it,expect,vi} from 'vitest'
import {NextRequest} from 'next/server'
import {proxy} from '../proxy'
const send=vi.hoisted(()=>vi.fn(async()=>({data:{id:'fixture'}})))
vi.mock('resend',()=>({Resend:class{emails={send}}}))
import {resend} from '../lib/emails'
beforeEach(()=>{
 process.env.BP_PAYMENT_TEST='1'
 process.env.STRIPE_SECRET_KEY='sk_test_fixture'
 process.env.BP_TEST_ACCESS_TOKEN='secret-access-token'
 process.env.CONTACT_TO_EMAIL='joel@stoltmarketing.se'
 send.mockClear()
})
const req=(path,auth=true)=>new NextRequest('https://test.invalid'+path,{headers:auth?{'x-bp-test-token':'secret-access-token'}:{}})
it('closes the complete test environment with live credentials',async()=>{
 process.env.STRIPE_SECRET_KEY='sk_live_fixture'
 expect((await proxy(req('/api/stripe/webhook'))).status).toBe(503)
 expect((await proxy(req('/test-inloggning'))).status).toBe(503)
})
it('requires test authentication and blocks unrelated APIs',async()=>{
 expect((await proxy(req('/kassa',false))).status).toBe(401)
 expect((await proxy(req('/api/create-payment-intent'))).status).toBe(200)
 expect((await proxy(req('/api/cron/veckorapport'))).status).toBe(503)
 expect((await proxy(req('/api/contact'))).status).toBe(503)
})
it('lets the original Stripe webhook verify signatures without a browser cookie',async()=>{
 expect((await proxy(req('/api/stripe/webhook',false))).status).toBe(200)
})
it('never sends outside the explicit test recipient including cc/bcc',async()=>{
 await expect(resend.emails.send({to:'customer@example.invalid'})).rejects.toThrow('allowlist')
 await expect(resend.emails.send({to:'joel@stoltmarketing.se',bcc:'customer@example.invalid'})).rejects.toThrow('allowlist')
 expect(send).not.toHaveBeenCalled()
})
it('marks permitted messages and preserves provider idempotency',async()=>{
 await resend.emails.send({to:'joel@stoltmarketing.se',subject:'Order'}, {idempotencyKey:'fixture'})
 expect(send).toHaveBeenCalledWith({to:'joel@stoltmarketing.se',subject:'[TEST] Order'},{idempotencyKey:'fixture'})
})
