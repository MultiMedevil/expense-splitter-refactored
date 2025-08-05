<template>
  <div class="users-section">
    <div class="section-header">
      <h1>Benutzerverwaltung</h1>
      <BaseButton @click="openUserModal" variant="primary">
        👤 Neuer Benutzer
      </BaseButton>
    </div>

    <div v-if="users.length === 0" class="empty-state">
      <p>Noch keine Benutzer vorhanden.</p>
      <BaseButton @click="openUserModal" variant="secondary">
        Ersten Benutzer anlegen
      </BaseButton>
    </div>

    <div v-else class="users-grid">
      <UserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
        @click="editUser(user)"
      />
    </div>

    <UserModal
      v-if="showUserModal"
      :show="showUserModal"
      :user="editingUser"
      :is-edit="!!editingUser"
      @close="closeUserModal"
      @save="saveUser"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import UserCard from './UserCard.vue'
import UserModal from './UserModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'

export default {
  name: 'UsersSection',
  components: {
    UserCard,
    UserModal,
    BaseButton
  },
  setup() {
    const usersStore = useUsersStore()
    const showUserModal = ref(false)
    const editingUser = ref(null)

    const users = computed(() => usersStore.users)

    const openUserModal = () => {
      editingUser.value = null
      showUserModal.value = true
    }

    const editUser = (user) => {
      editingUser.value = user
      showUserModal.value = true
    }

    const closeUserModal = () => {
      showUserModal.value = false
      editingUser.value = null
    }

    const saveUser = (userData) => {
      if (editingUser.value) {
        usersStore.updateUser(editingUser.value.id, userData)
      } else {
        usersStore.addUser(userData)
      }
      closeUserModal()
    }

    return {
      users,
      showUserModal,
      editingUser,
      openUserModal,
      editUser,
      closeUserModal,
      saveUser
    }
  }
}
</script>

<style scoped>
.users-section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h1 {
  margin: 0;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state p {
  margin-bottom: 1rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
</style>
