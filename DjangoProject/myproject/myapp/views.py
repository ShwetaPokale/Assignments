from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password, check_password
from django.contrib import messages  # Import messages module for displaying messages
from .forms import SignupForm, LoginForm
from .models import users

def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            # Hash the password before saving
            hashed_password = make_password(password)
            user = users.objects.create(username=username, email=email, password=hashed_password)
            user.save()
            # Add a success message
            messages.success(request, 'Account created successfully. You can now log in.')
            return redirect('login')  # Redirect to login page after successful signup
    else:
        form = SignupForm()
    return render(request, 'myapp/signup.html', {'form': form})

def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            try:
                user = users.objects.get(email=email)
                # Check if password matches (use check_password)
                if check_password(password, user.password):
                    # Add a success message
                    messages.success(request, 'Login successful.')
                    # Redirect to home page after successful login
                    # return redirect('home')
                else:
                    return render(request, 'myapp/login.html', {'form': form, 'error': 'Invalid credentials'})
            except users.DoesNotExist:
                return render(request, 'myapp/login.html', {'form': form, 'error': 'Invalid credentials'})
    else:
        form = LoginForm()
    return render(request, 'myapp/login.html', {'form': form})
