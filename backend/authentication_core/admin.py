from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class UserAdmin(admin.ModelAdmin):
    model = User
    list_display = ['email', 'username', 'public_name', 'is_staff', 'is_superuser', 'is_verified']
    fieldsets = (
        (None, {'fields': ('email', 'username')}),
        ('Personal info', {'fields': ('public_name', 'bio', 'profile_picture')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified','groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'username')
    ordering = ('email',)

admin.site.register(User, UserAdmin)