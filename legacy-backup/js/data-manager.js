// Datenmanagement für LocalStorage
window.DataManager = {
  saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  },
  loadUsers() {
    const raw = localStorage.getItem('users');
    return raw ? JSON.parse(raw) : [];
  }
};
