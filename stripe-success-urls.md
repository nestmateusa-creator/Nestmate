# Stripe Success URL Configuration

## Success URLs for Each Plan

Configure these success URLs in your Stripe dashboard for each payment link:

### Monthly Plans:
- **Basic Monthly**: `https://nestmateus.com/payment-success.html?success=true&plan=9B600lc6u4oneY50Ch1sQ0M`
- **Pro Monthly**: `https://nestmateus.com/payment-success.html?success=true&plan=14AeVf4E29IHbLT4Sx1sQ0N`
- **Advanced Pro Monthly**: `https://nestmateus.com/payment-success.html?success=true&plan=9B628t1rQ2gfdU1et71sQ0O`
- **Enterprise Monthly**: `https://nestmateus.com/payment-success.html?success=true&plan=14A9AV2vU1cb3fn4Sx1sQ0Q`

### Yearly Plans:
- **Basic Yearly**: `https://nestmateus.com/payment-success.html?success=true&plan=cNi3cx3zY3kj6rzckZ1sQ0R`
- **Pro Yearly**: `https://nestmateus.com/payment-success.html?success=true&plan=bJe6oJ0nMg755nv0Ch1sQ0S`
- **Advanced Pro Yearly**: `https://nestmateus.com/payment-success.html?success=true&plan=14AcN7eeC8ED3fn4Sx1sQ0T`
- **Enterprise Yearly**: `https://nestmateus.com/payment-success.html?success=true&plan=aFa4gB8UiaML3fn1Gl1sQ0U`

## How to Configure in Stripe:

1. Go to your Stripe Dashboard
2. Navigate to "Payment Links"
3. For each payment link, click "Edit"
4. In the "After payment" section, set the success URL to the corresponding URL above
5. Save the changes

## Dashboard Redirects:

After successful payment, users will be redirected to:
- **Basic**: `dashboard-basic-clean.html`
- **Pro**: `dashboard-advanced.html`
- **Advanced Pro**: `dashboard-advanced-pro.html`
- **Enterprise**: `dashboard-enterprise.html`

## Payment Links:

### Monthly:
- Basic: https://buy.stripe.com/9B600lc6u4oneY50Ch1sQ0M
- Pro: https://buy.stripe.com/14AeVf4E29IHbLT4Sx1sQ0N
- Advanced Pro: https://buy.stripe.com/9B628t1rQ2gfdU1et71sQ0O
- Enterprise: https://buy.stripe.com/14A9AV2vU1cb3fn4Sx1sQ0Q

### Yearly:
- Basic: https://buy.stripe.com/cNi3cx3zY3kj6rzckZ1sQ0R
- Pro: https://buy.stripe.com/bJe6oJ0nMg755nv0Ch1sQ0S
- Advanced Pro: https://buy.stripe.com/14AcN7eeC8ED3fn4Sx1sQ0T
- Enterprise: https://buy.stripe.com/aFa4gB8UiaML3fn1Gl1sQ0U
