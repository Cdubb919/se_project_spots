export function setButtonText(button, isLoading, defaultText = "Save", loadingText = "Saving...") {
  if (!button) return;
  button.textContent = isLoading ? loadingText : defaultText;
}

export function _checkResponse(response) {
  if (!response.ok) {
    return response.json().then(err => {
      throw new Error(err.message || 'Server error');
    });
  }
  return response.json();
}