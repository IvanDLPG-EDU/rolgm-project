from django.core.mail import EmailMessage
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

class Util:
    @staticmethod
    def send_email(data):
        # Renderiza el template del email
        html_message = render_to_string(
            'email_template.html', {'user': data['user'], 'absurl': data['absurl']})

        # Remueve las etiquetas HTML para obtener el texto plano
        plain_message = strip_tags(html_message)

        email = EmailMultiAlternatives(
            subject=data['subject'],
            body=plain_message,
            to=[data['email']]
        )

        # Adjunta el contenido HTML
        email.attach_alternative(html_message, 'text/html')
        email.send()
