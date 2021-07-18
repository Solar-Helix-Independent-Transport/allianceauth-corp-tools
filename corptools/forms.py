from django import forms


class UploadForm(forms.Form):
    name = forms.CharField(max_length=255)
    file = forms.FileField()
