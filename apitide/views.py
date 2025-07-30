from django.shortcuts import render, redirect
from .models import *
from django.core.mail import send_mail
# Create your views here.


def home(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')

        if name and email and message:
            # Save to DB
            contactCard.objects.create(name=name, email=email, message=message)

            # Send email
            subject = "Thank you for contacting us!"
            body = f"Hi {name},\n\nWe received your message:\n We'll get back to you shortly!"
            from_email = None  # Uses DEFAULT_FROM_EMAIL
            recipient_list = [email]

            send_mail(subject, body, from_email, recipient_list)

            try:
                send_mail(subject, body, from_email, recipient_list)
            except Exception as e:
                print(f"Email failed to send: {e}")  # Logs on Render


            return redirect('/?success=true')

    success = request.GET.get('success') == 'true'
    return render(request, 'index.html', {'success': success})

    




