// components/personal/index.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, Bug, CheckCircle2, Crown, TrendingUp, Zap,
  ListTodo, BugOff, Calendar
} from 'lucide-react';
import { ProfileHero } from './ProfileHero';
import { MetricCards } from './MetricCard';
import { DataTable } from './DataTable';
import { 
  bugHistory, 
  completedSubtasks, 
  currentUser, 
  productivityRanking,
} from '@/lib/mock-data';
import styles from './styles.module.scss';

type TabType = 'tasks' | 'bugs';

const Personal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const rank = productivityRanking.findIndex((e) => e.id === currentUser.id) + 1;

  return (
    <div className={styles.container}>
       {/* Profile Hero */}
      <ProfileHero user={currentUser} rank={rank} />

      {/* Metric Cards */}
      <MetricCards user={currentUser} />

      {/* Tabs for Data Tables */}
      <div className={styles.tabsSection}>
        <div className={styles.tabGroup}>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`${styles.tabButton} ${activeTab === 'tasks' ? styles.tabActive : ''}`}
          >
            <ListTodo size={16} />
            Completed Subtasks
            <span className={styles.tabCount}>{completedSubtasks.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('bugs')}
            className={`${styles.tabButton} ${activeTab === 'bugs' ? styles.tabActive : ''}`}
          >
            <BugOff size={16} />
            Bug History
            <span className={styles.tabCount}>{bugHistory.length}</span>
          </button>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.tabContent}
        >
          {activeTab === 'tasks' && (
            <DataTable
              title="Completed Subtasks"
              columns={['Task ID', 'Summary', 'Project', 'Date', 'Status']}
              rows={completedSubtasks.slice(0, 8).map((t) => [
                t.id, 
                t.summary, 
                t.project, 
                t.date, 
                t.status
              ])}
            />
          )}
          {activeTab === 'bugs' && (
            <DataTable
              title="Bug History"
              columns={['Bug ID', 'Summary', 'Priority', 'Date', 'Status']}
              rows={bugHistory.slice(0, 8).map((b) => [
                b.id, 
                b.summary, 
                b.priority, 
                b.date, 
                b.status
              ])}
              priorityIdx={2}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Personal;