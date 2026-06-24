'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Priority levels
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Announcement
export interface Announcement {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  meetingLink?: string;
  attachment?: string;
  postedBy: string;
  postedDate: string;
  status: 'draft' | 'published';
  views: number;
  isPinned: boolean;
}

// FAQ Category type
export type FAQCategory = 'Onboarding' | 'GitHub' | 'Standups' | 'Projects' | 'Teams' | 'Certificates';

// FAQ
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  helpfulCount: number;
  views: number;
  helpfulByUsers: string[]; // List of user emails who voted helpful
}

// User Profile
export interface UserProfile {
  name: string;
  email: string;
  role: 'admin' | 'intern';
  team?: string;
  joinDate: string;
  avatarUrl?: string;
  streak: number;
  tasksCompleted: number;
}

// Notification
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'announcement' | 'faq' | 'system';
  targetUrl?: string;
}

// Team Details
export interface Team {
  id: string;
  name: string;
  teamLead: string;
  members: string[];
  progress: number; // percentage
  score: number; // leaderboard points
  activity: string[];
}

// Resource Card
export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
  type: 'github' | 'docs' | 'learning' | 'meeting' | 'submission';
}

// Chat Message
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  announcements: Announcement[];
  faqs: FAQ[];
  notifications: NotificationItem[];
  teams: Team[];
  resources: Resource[];
  chatHistory: ChatMessage[];
  isAiTyping: boolean;
  login: (email: string, role: 'admin' | 'intern') => boolean;
  logout: () => void;
  // Theme Toggles
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  // Announcement Actions
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'postedBy' | 'postedDate' | 'views'>) => void;
  editAnnouncement: (id: string, updated: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  togglePinAnnouncement: (id: string) => void;
  incrementAnnouncementViews: (id: string) => void;
  // FAQ Actions
  createFAQ: (faq: Omit<FAQ, 'id' | 'helpfulCount' | 'views' | 'helpfulByUsers'>) => void;
  editFAQ: (id: string, updated: Partial<FAQ>) => void;
  deleteFAQ: (id: string) => void;
  voteHelpfulFAQ: (id: string, email: string) => void;
  incrementFAQViews: (id: string) => void;
  // Notification Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  // Profile Actions
  updateProfile: (updated: Partial<UserProfile>) => void;
  // AI Actions
  sendChatMessage: (message: string) => void;
  clearChat: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Data
const defaultAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Daily Standup Call Link Update',
    description: 'We are moving the daily standups to Google Meet. Standups will run at 10:00 AM IST sharp. Attendance is mandatory for all interns.',
    priority: 'urgent',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    postedBy: 'Admin Mentor',
    postedDate: '2026-06-24',
    status: 'published',
    views: 42,
    isPinned: true,
  },
  {
    id: 'ann-2',
    title: 'Mid-term Project Review Submissions',
    description: 'Please upload your code structure and Figma wireframes to the submission portal before the end of this week. Late submissions will affect your final evaluation.',
    priority: 'high',
    meetingLink: 'https://internflow.ai/submissions/mid-term',
    postedBy: 'Admin Mentor',
    postedDate: '2026-06-23',
    status: 'published',
    views: 29,
    isPinned: false,
  },
  {
    id: 'ann-3',
    title: 'Git & GitHub Best Practices Session',
    description: 'A training session on branching strategy, squash committing, and writing clean pull requests will be hosted this Friday by our Lead Engineer.',
    priority: 'medium',
    meetingLink: 'https://zoom.us/j/987654321',
    postedBy: 'Lead Mentor',
    postedDate: '2026-06-22',
    status: 'published',
    views: 18,
    isPinned: false,
  },
  {
    id: 'ann-4',
    title: 'Internship Onboarding Manual Draft',
    description: 'Find attached the draft of the new onboarding document. Feel free to leave comments on sections that need more clarity.',
    priority: 'low',
    attachment: 'Onboarding_Manual_v1.2.pdf',
    postedBy: 'HR Coordinator',
    postedDate: '2026-06-20',
    status: 'draft',
    views: 4,
    isPinned: false,
  }
];

const defaultFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I submit my daily progress report?',
    answer: 'Navigate to the Dashboard, look for the "Daily Progress Tracker" widget under Tasks Completed, and check off your completed items. You should also write a quick summary in the `#daily-standup` Discord/Slack channel.',
    category: 'Onboarding',
    helpfulCount: 24,
    views: 110,
    helpfulByUsers: []
  },
  {
    id: 'faq-2',
    question: 'Where can I find my team meeting links?',
    answer: 'All common meeting links are available on the Resources page under "Meeting Links". For team-specific meetings, please check with your designated Team Lead on the Teams page or check your email calendar invites.',
    category: 'Standups',
    helpfulCount: 15,
    views: 84,
    helpfulByUsers: []
  },
  {
    id: 'faq-3',
    question: 'What is the branching convention for GitHub submissions?',
    answer: 'Please fork the main repository and create branches matching this format: `feature/yourname-feature-slug`. Always create a pull request targeting the `dev` branch of the upstream repository, never `main`.',
    category: 'GitHub',
    helpfulCount: 31,
    views: 145,
    helpfulByUsers: []
  },
  {
    id: 'faq-4',
    question: 'How do we coordinate in cross-functional teams?',
    answer: 'Each team has a dedicated Team Lead. Check the Teams Page to find your lead and peers. You can schedule coordinate syncs via the Zoom/Meet links provided, and organize your work using the Shared Notion Board.',
    category: 'Teams',
    helpfulCount: 12,
    views: 52,
    helpfulByUsers: []
  },
  {
    id: 'faq-5',
    question: 'When and how will certificates be distributed?',
    answer: 'Internship certificates are generated and distributed within 7-10 working days after your final evaluation and submission of all project resources. You can download a digital copy from your Profile page once released.',
    category: 'Certificates',
    helpfulCount: 9,
    views: 40,
    helpfulByUsers: []
  },
  {
    id: 'faq-6',
    question: 'What should we do if we face a blocker during projects?',
    answer: 'First, search this FAQ database or describe your issue to the AI Assistant on the AI page. If it is still unresolved, post it in the `#tech-support` chat channel or bring it up during the next standup call.',
    category: 'Projects',
    helpfulCount: 18,
    views: 92,
    helpfulByUsers: []
  }
];

const defaultNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Daily Standup Call Link Update',
    message: 'Mandatory Google Meet standup link was updated by Admin.',
    time: '10 mins ago',
    isRead: false,
    type: 'announcement',
    targetUrl: '/dashboard/intern/announcements',
  },
  {
    id: 'notif-2',
    title: 'New FAQ added: GitHub Conventions',
    message: 'Admin added a new entry under the GitHub category.',
    time: '2 hours ago',
    isRead: true,
    type: 'faq',
    targetUrl: '/dashboard/intern/faqs',
  }
];

const defaultTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Team Horizon (AI/ML)',
    teamLead: 'Aarav Mehta',
    members: ['intern@internflow.ai', 'priya.sharma@internflow.ai', 'rohan.patel@internflow.ai', 'sneha.reddy@internflow.ai'],
    progress: 78,
    score: 940,
    activity: [
      'Submitted Mid-term codebase wireframes',
      'Completed Sprint 2 Planning meeting',
      'Aarav reviewed Roahn\'s PR for core backend'
    ]
  },
  {
    id: 'team-2',
    name: 'Team CyberPulse (Web Dev)',
    teamLead: 'Kabir Kapoor',
    members: ['neha.verma@internflow.ai', 'aditya.sen@internflow.ai', 'vikram.singh@internflow.ai'],
    progress: 62,
    score: 810,
    activity: [
      'Integrated authentication layouts',
      'Resolved merge conflict in Tailwind imports',
      'Setup PostgreSQL DB schema locally'
    ]
  },
  {
    id: 'team-3',
    name: 'Team CloudOps (Infra)',
    teamLead: 'Elena Gilbert',
    members: ['stefan.salvatore@internflow.ai', 'damon.salvatore@internflow.ai'],
    progress: 89,
    score: 1120,
    activity: [
      'Deployed Dev Staging server on AWS ECS',
      'Configured Dockerfiles with multi-stage build',
      'Setup GitHub Actions pipeline for lint tests'
    ]
  }
];

const defaultResources: Resource[] = [
  {
    id: 'res-1',
    title: 'Core Repository (GitHub)',
    description: 'The master codebase for the group projects. Fork and submit pull requests here.',
    category: 'GitHub Repository',
    link: 'https://github.com/internflow-ai/core-workspace',
    type: 'github',
  },
  {
    id: 'res-2',
    title: 'Onboarding & Guidelines Docs',
    description: 'Detailed guidelines explaining standard operating procedures, deliverables, and timelines.',
    category: 'Documentation',
    link: 'https://notion.so/internflow-onboarding-docs',
    type: 'docs',
  },
  {
    id: 'res-3',
    title: 'React & Next.js Advanced Tutorials',
    description: 'Curated list of articles, videos, and documentation for Vite, App Router, and Tailwind.',
    category: 'Learning Resources',
    link: 'https://nextjs.org/docs',
    type: 'learning',
  },
  {
    id: 'res-4',
    title: 'Daily Standup (Google Meet)',
    description: 'Active link for the mandatory daily status updates meeting (Every weekday 10:00 AM IST).',
    category: 'Meeting Links',
    link: 'https://meet.google.com/abc-defg-hij',
    type: 'meeting',
  },
  {
    id: 'res-5',
    title: 'Weekly Deliverables Submission',
    description: 'Portal link to submit weekly reports, wireframes, and GitHub pull request URLs.',
    category: 'Submission Links',
    link: 'https://forms.gle/internflow-weekly-submissions',
    type: 'submission',
  }
];

const defaultChat: ChatMessage[] = [
  {
    id: 'chat-1',
    sender: 'ai',
    content: 'Hello! I am **InternFlow AI**, your virtual mentor assistant. Ask me anything about standard procedures, standups, Git commands, project guidelines, or resources.',
    timestamp: '9:44 AM'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initialize and load state from localStorage if available
  useEffect(() => {
    const localUser = localStorage.getItem('if_current_user');
    const localAnnouncements = localStorage.getItem('if_announcements');
    const localFaqs = localStorage.getItem('if_faqs');
    const localNotifs = localStorage.getItem('if_notifications');
    const localTeams = localStorage.getItem('if_teams');
    const localResources = localStorage.getItem('if_resources');
    const localChat = localStorage.getItem('if_chat_history');
    const localTheme = (localStorage.getItem('if_theme') as 'dark' | 'light') || 'dark';

    if (localUser) setCurrentUser(JSON.parse(localUser));
    
    setAnnouncements(localAnnouncements ? JSON.parse(localAnnouncements) : defaultAnnouncements);
    setFaqs(localFaqs ? JSON.parse(localFaqs) : defaultFAQs);
    setNotifications(localNotifs ? JSON.parse(localNotifs) : defaultNotifications);
    setTeams(localTeams ? JSON.parse(localTeams) : defaultTeams);
    setResources(localResources ? JSON.parse(localResources) : defaultResources);
    setChatHistory(localChat ? JSON.parse(localChat) : defaultChat);

    // Initialize Theme
    setTheme(localTheme);
    if (localTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('if_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Save changes helper
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const login = (email: string, role: 'admin' | 'intern'): boolean => {
    let matchedUser: UserProfile;
    if (role === 'admin' && email === 'admin@internflow.ai') {
      matchedUser = {
        name: 'Alex Mercer',
        email: 'admin@internflow.ai',
        role: 'admin',
        joinDate: '2026-01-15',
        avatarUrl: '/avatars/admin.png',
        streak: 15,
        tasksCompleted: 45
      };
    } else if (role === 'intern' && email === 'intern@internflow.ai') {
      matchedUser = {
        name: 'Jane Doe',
        email: 'intern@internflow.ai',
        role: 'intern',
        team: 'Team Horizon (AI/ML)',
        joinDate: '2026-06-01',
        avatarUrl: '/avatars/intern.png',
        streak: 8,
        tasksCompleted: 12
      };
    } else {
      return false; // Auth failure
    }

    setCurrentUser(matchedUser);
    localStorage.setItem('if_current_user', JSON.stringify(matchedUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('if_current_user');
  };

  // Profile Update
  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updated };
    setCurrentUser(newUser);
    saveState('if_current_user', newUser);
  };

  // Announcement Actions
  const createAnnouncement = (ann: Omit<Announcement, 'id' | 'postedBy' | 'postedDate' | 'views'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      postedBy: currentUser?.name || 'Admin',
      postedDate: new Date().toISOString().split('T')[0],
      views: 0,
    };
    
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    saveState('if_announcements', updated);

    // If published, trigger reactive notification for Interns
    if (ann.status === 'published') {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Announcement: ${ann.title}`,
        message: ann.description.substring(0, 75) + '...',
        time: 'Just now',
        isRead: false,
        type: 'announcement',
        targetUrl: '/dashboard/intern/announcements',
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      saveState('if_notifications', updatedNotifs);
    }
  };

  const editAnnouncement = (id: string, updated: Partial<Announcement>) => {
    const list = announcements.map(a => a.id === id ? { ...a, ...updated } : a);
    setAnnouncements(list);
    saveState('if_announcements', list);
  };

  const deleteAnnouncement = (id: string) => {
    const list = announcements.filter(a => a.id !== id);
    setAnnouncements(list);
    saveState('if_announcements', list);
  };

  const togglePinAnnouncement = (id: string) => {
    const list = announcements.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a);
    setAnnouncements(list);
    saveState('if_announcements', list);
  };

  const incrementAnnouncementViews = (id: string) => {
    const list = announcements.map(a => a.id === id ? { ...a, views: a.views + 1 } : a);
    setAnnouncements(list);
    saveState('if_announcements', list);
  };

  // FAQ Actions
  const createFAQ = (faq: Omit<FAQ, 'id' | 'helpfulCount' | 'views' | 'helpfulByUsers'>) => {
    const newFaq: FAQ = {
      ...faq,
      id: `faq-${Date.now()}`,
      helpfulCount: 0,
      views: 0,
      helpfulByUsers: []
    };
    const updated = [newFaq, ...faqs];
    setFaqs(updated);
    saveState('if_faqs', updated);

    // Trigger Notification for new FAQ
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `New FAQ under ${faq.category}`,
      message: `FAQ: "${faq.question}" has been added.`,
      time: 'Just now',
      isRead: false,
      type: 'faq',
      targetUrl: '/dashboard/intern/faqs',
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveState('if_notifications', updatedNotifs);
  };

  const editFAQ = (id: string, updated: Partial<FAQ>) => {
    const list = faqs.map(f => f.id === id ? { ...f, ...updated } : f);
    setFaqs(list);
    saveState('if_faqs', list);
  };

  const deleteFAQ = (id: string) => {
    const list = faqs.filter(f => f.id !== id);
    setFaqs(list);
    saveState('if_faqs', list);
  };

  const voteHelpfulFAQ = (id: string, email: string) => {
    const list = faqs.map(f => {
      if (f.id === id) {
        const hasVoted = f.helpfulByUsers.includes(email);
        const helpfulByUsers = hasVoted
          ? f.helpfulByUsers.filter(u => u !== email)
          : [...f.helpfulByUsers, email];
        const helpfulCount = hasVoted ? f.helpfulCount - 1 : f.helpfulCount + 1;
        return { ...f, helpfulCount, helpfulByUsers };
      }
      return f;
    });
    setFaqs(list);
    saveState('if_faqs', list);
  };

  const incrementFAQViews = (id: string) => {
    const list = faqs.map(f => f.id === id ? { ...f, views: f.views + 1 } : f);
    setFaqs(list);
    saveState('if_faqs', list);
  };

  // Notification Actions
  const markNotificationRead = (id: string) => {
    const list = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(list);
    saveState('if_notifications', list);
  };

  const markAllNotificationsRead = () => {
    const list = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(list);
    saveState('if_notifications', list);
  };

  const clearNotifications = () => {
    setNotifications([]);
    saveState('if_notifications', []);
  };

  // AI Actions (ChatGPT style helper responses)
  const sendChatMessage = (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newChatHistory = [...chatHistory, userMsg];
    setChatHistory(newChatHistory);
    saveState('if_chat_history', newChatHistory);
    setIsAiTyping(true);

    // Simulate AI response response after 1.5s
    setTimeout(() => {
      let aiResponseText = "I'm not fully sure about that detail. Let me consult my knowledge base! You can also check the resource cards on the Resources page or read the Onboarding FAQs.";
      
      const normalizedMsg = messageText.toLowerCase();
      if (normalizedMsg.includes('standup') || normalizedMsg.includes('meeting')) {
        aiResponseText = `The daily standup meeting is hosted on **Google Meet** every weekday at **10:00 AM IST** sharp. Attendance is mandatory.

You can join directly using this link: 
[Google Meet - Daily Standup](https://meet.google.com/abc-defg-hij)

Please prepare to report:
1. What you accomplished yesterday
2. What you are working on today
3. Any blockers you are currently facing`;
      } else if (normalizedMsg.includes('submit') || normalizedMsg.includes('upload') || normalizedMsg.includes('deliverable')) {
        aiResponseText = `To submit your weekly projects, reports, or deliverables:
1. Make sure your changes are squashed, pushed to your fork on GitHub, and a PR is opened targeting the \`dev\` branch of the main repo.
2. Fill out the submission form on the **Resources** page:
[Deliverables Submission Portal](https://forms.gle/internflow-weekly-submissions)
3. Input your team name, list of contributors, a short summary of work, and the links to your PRs and hosted demo.`;
      } else if (normalizedMsg.includes('git') || normalizedMsg.includes('github') || normalizedMsg.includes('branch')) {
        aiResponseText = `We follow a strict Git branching strategy during the internship:
* Always work on a feature branch created off \`dev\`.
* Branch format: \`feature/yourname-feature-slug\`
* Push and open a pull request (PR) targeting the upstream \`dev\` branch.
* Write clear commits and description logs. Never merge code directly without review from your designated Team Lead.

Here is a quick cheat sheet for command line setup:
\`\`\`bash
# Fork & clone
git clone https://github.com/internflow-ai/core-workspace.git
# Create branch
git checkout -b feature/jane-auth-layout
# Make edits & commit
git add .
git commit -m "feat: design auth login screens and forms"
# Push to origin
git push origin feature/jane-auth-layout
\`\`\`
Let me know if you hit merge conflicts!`;
      } else if (normalizedMsg.includes('mentor') || normalizedMsg.includes('lead') || normalizedMsg.includes('who is my')) {
        aiResponseText = `Your primary internship coordinator is the **Admin Mentor** (Alex Mercer). 
Your team lead depends on your team assignment:
- **Team Horizon (AI/ML):** Aarav Mehta
- **Team CyberPulse (Web Dev):** Kabir Kapoor
- **Team CloudOps (Infra):** Elena Gilbert

You can view contact details and progress for each team on the **Teams** tab of the dashboard.`;
      } else if (normalizedMsg.includes('team') || normalizedMsg.includes('join')) {
        aiResponseText = `You can join your team workspace by coordinating with your Team Lead (listed on the **Teams** page). 

If you are not yet assigned a team, please contact the **Admin Mentor** at \`admin@internflow.ai\` or write in the onboarding channel so we can assign you a squad. Currently, we have 3 teams active:
* **Team Horizon** (AI/ML)
* **Team CyberPulse** (Web Webdev)
* **Team CloudOps** (Infra & AWS Deployments)`;
      }

      const aiMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        sender: 'ai',
        content: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalChat = [...newChatHistory, aiMsg];
      setChatHistory(finalChat);
      saveState('if_chat_history', finalChat);
      setIsAiTyping(false);
    }, 1500);
  };

  const clearChat = () => {
    setChatHistory(defaultChat);
    saveState('if_chat_history', defaultChat);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      announcements,
      faqs,
      notifications,
      teams,
      resources,
      chatHistory,
      isAiTyping,
      login,
      logout,
      theme,
      toggleTheme,
      createAnnouncement,
      editAnnouncement,
      deleteAnnouncement,
      togglePinAnnouncement,
      incrementAnnouncementViews,
      createFAQ,
      editFAQ,
      deleteFAQ,
      voteHelpfulFAQ,
      incrementFAQViews,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      updateProfile,
      sendChatMessage,
      clearChat
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
