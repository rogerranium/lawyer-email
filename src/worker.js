import { Hono } from 'hono';
import { logger } from 'hono/logger';

const app = new Hono()
app.use('*', logger());

// Add X-Response-Time header
app.use('*', async (c, next) => {
	const start = Date.now()
	await next()
	const ms = Date.now() - start
	c.header('X-Response-Time', `${ms}ms`)
})

app.get('/:status/:email/:name', async (c) => {
	const status = c.req.param('status');
	const email = c.req.param('email');
	const name = c.req.param('name');

	let params = {
		user_id: 'pVTePyDbM6hx90xPD',
		service_id: 'service_8f85aug',
		template_id: 'template_fgovtzm',
		template_params: {
			'destinataire': email,
			'name': name
		}
	};

	let headers = {
		'Content-type': 'application/json',
		'origin': '*'
	};

	let options = {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(params)
	};

	try {
		const result = await fetch('https://api.emailjs.com/api/v1.0/email/send', options)
		if (result.ok) {
			return c.json({ status: status, email: email, name: name, httpResponse: "Email sent" })
		} else {
			return c.json({ status: "email not send !!!", email: email, })
		}
	} catch (error) {
		console.log('Oops... ' + error);
	}

})

export default app