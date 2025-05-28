<template>
  <div class="help-container">
    <!-- Header -->
    <div class="header-section">
      <div class="content-wrapper">
        <p class="service-label">Hibiki Music Support Service</p>
        <h1 class="main-title">How can we help you?</h1>
        
        <!-- Search bar -->
        <div class="search-container">
          <svg class="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            v-model="searchTerm"
            class="search-input"
          />
        </div>

        <!-- Help sections -->
        <div class="help-sections">
          <div 
            v-for="section in helpSections" 
            :key="section.id" 
            class="help-section"
          >
            <button
              @click="toggleSection(section.id)"
              class="section-button"
            >
              <div class="section-header">
                <span class="section-icon" v-html="section.icon"></span>
                <span class="section-title">{{ section.title }}</span>
              </div>
              <svg 
                class="chevron-icon"
                :class="{ 'expanded': expandedSection === section.id }"
                width="20" 
                height="20"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
              </svg>
            </button>
            
            <div v-if="expandedSection === section.id" class="section-content">
              <p class="content-text">{{ section.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick help section -->
    <div class="quick-help-section">
      <div class="content-wrapper">
        <h2 class="section-title-large">Quick Help</h2>
        <div class="quick-help-items">
          <button
            v-for="(item, index) in quickHelpItems"
            :key="index"
            class="quick-help-item"
          >
            <span>{{ item }}</span>
            <svg class="item-chevron" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Community section -->
    <div class="community-section">
      <div class="content-wrapper">
        <h2 class="community-title">Visit the Community</h2>
        <p class="community-description">
          Have questions or doubts? Find answers in our worldwide Community full of fans and experts.
        </p>
        <button class="community-button">
          Go to Community
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AyudaView',
  data() {
    return {
      expandedSection: null,
      searchTerm: '',
      helpSections: [
        {
          id: 'payment',
          title: 'Payment and Billing',
          icon: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>',
          content: 'Manage your subscription, update payment methods, view billing history, and resolve payment issues. Get help with Premium plans, family accounts, and subscription changes.'
        },
        {
          id: 'account',
          title: 'Account Management',
          icon: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
          content: 'Access your account settings, change your password, update personal information, and manage privacy settings. Learn how to delete or recover your account.'
        },
        {
          id: 'premium',
          title: 'Premium Plans',
          icon: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>',
          content: 'Discover Premium features, compare plan options, learn about family and student discounts. Understand the benefits of ad-free listening and offline downloads.'
        },
        {
          id: 'features',
          title: 'App Features and Functions',
          icon: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>',
          content: 'Learn how to use playlists, discover new music, use Hibiki Connect, and navigate the app. Get tips for creating and sharing your favorite content.'
        },
        {
          id: 'troubleshooting',
          title: 'Troubleshooting and Problem Solving',
          icon: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>',
          content: 'Fix common issues like playback problems, app crashes, login difficulties, and sync issues. Solutions for mobile, desktop, and web player problems.'
        },
        {
          id: 'security',
          title: 'Security and Privacy',
          icon: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
          content: 'Protect your account with security best practices, manage data privacy settings, control what information you share, and report suspicious activity.'
        }
      ],
      quickHelpItems: [
        'Can\'t log into Hibiki Music',
        'Help with payment errors',
        'My music disappeared',
        'How to cancel membership or plan',
        'How to change plan options'
      ]
    }
  },
  methods: {
    toggleSection(sectionId) {
      this.expandedSection = this.expandedSection === sectionId ? null : sectionId;
    }
  }
}
</script>

<style scoped>
.help-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #ff5100, #000000);
  color: white;
}

.header-section {
  padding: 2rem 1.5rem;
}

.content-wrapper {
  max-width: 64rem;
  margin: 0 auto;
}

.service-label {
  color: #fed7aa;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.main-title {
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.user-greeting {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background-color: #4b5563;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.user-name {
  font-size: 1.125rem;
}

.search-container {
  position: relative;
  margin-bottom: 2rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  background-color: white;
  color: black;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
}

.search-input:focus {
  box-shadow: 0 0 0 2px #ff5100;
}

.help-sections {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3rem;
}

.help-section {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0.5rem;
  overflow: hidden;
}

.section-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  text-align: left;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.section-button:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

.section-header {
  display: flex;
  align-items: center;
}

.section-icon {
  color: #ff5100;
  margin-right: 0.75rem;
}

.section-title {
  font-weight: 500;
}

.chevron-icon {
  color: #9ca3af;
  transition: transform 0.2s;
}

.chevron-icon.expanded {
  transform: rotate(90deg);
}

.section-content {
  padding: 0 1rem 1rem 3rem;
}

.content-text {
  color: #d1d5db;
  line-height: 1.6;
}

.quick-help-section {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2rem 1.5rem;
}

.section-title-large {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.quick-help-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quick-help-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: rgba(31, 41, 55, 0.5);
  border-radius: 0.5rem;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.quick-help-item:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

.item-chevron {
  color: #9ca3af;
}

.community-section {
  padding: 3rem 1.5rem;
  text-align: center;
}

.community-title {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.community-description {
  color: #d1d5db;
  margin-bottom: 2rem;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}

.community-button {
  background-color: #ff5100;
  color: white;
  font-weight: bold;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.community-button:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 1.875rem;
  }
  
  .header-section {
    padding: 1.5rem 1rem;
  }
  
  .quick-help-section {
    padding: 1.5rem 1rem;
  }
  
  .community-section {
    padding: 2rem 1rem;
  }
}
</style>