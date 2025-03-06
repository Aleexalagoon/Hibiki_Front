<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const dropdownVisible = ref(false);
const userDropdownRef = ref<HTMLElement | null>(null);

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const getUserInitial = computed(() => {
  const userName = authStore.user?.name || authStore.user?.email || '';
  return userName.charAt(0).toUpperCase();
});

const getUserName = computed(() => {
  return authStore.user?.name || authStore.user?.email || 'Usuario';
});

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target as Node)) {
    dropdownVisible.value = false;
  }
};

const goToProfile = () => {
  router.push('/perfil');
  dropdownVisible.value = false;
};

const logout = () => {
  authStore.logout();
  router.push('/login');
  dropdownVisible.value = false;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div
    v-if="isAuthenticated"
    ref="userDropdownRef"
    class="user-profile-component"
  >
    <div class="user-icon" @click.stop="toggleDropdown">
      <span>{{ getUserInitial }}</span>
    </div>
    
    <div
      v-if="dropdownVisible"
      class="user-dropdown"
    >
      <div class="user-info">
        <div class="user-icon user-icon-small">
          <span>{{ getUserInitial }}</span>
        </div>
        <div class="user-details">
          <p class="user-name">{{ getUserName }}</p>
          <p class="user-email">{{ authStore.user?.email }}</p>
        </div>
      </div>
      
      <div class="dropdown-divider"></div>
      
      <div class="dropdown-menu">
        <div class="dropdown-item" @click="goToProfile">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Perfil</span>
        </div>
        <div class="dropdown-item" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-profile-component {
  position: relative;
  cursor: pointer;
}

.user-icon {
  width: 40px;
  height: 40px;
  background-color: #ff5100;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-icon:hover {
  background-color: #ca3900;
}

.user-icon-small {
  width: 40px;
  height: 40px;
  font-size: 0.9rem;
}

.user-dropdown {
  position: absolute;
  top: 55px;
  right: 0;
  width: 250px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  border: 1px solid #e0e0e0;
  z-index: 1200;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
}

.user-details {
  margin-left: 15px;
}

.user-name {
  font-weight: bold;
  margin: 0;
}

.user-email {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.dropdown-divider {
  height: 1px;
  background-color: #e0e0e0;
}

.dropdown-menu {
  padding: 10px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f1f3f5;
}

.dropdown-item svg {
  margin-right: 10px;
  stroke: #6c757d;
}

.dropdown-item span {
  color: #333;
}
</style>