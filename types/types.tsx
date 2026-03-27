// This file contains the types and enum for the application
// Define system interfaces and types here

import { JSX } from "react";

type UserProps = {
  userName: string;
  userType: string;
};

type NavItem = {
    title: string;
    path: string;
    color?: string;
    icon?: JSX.Element;
    submenu?: boolean;
    subMenuItems?: NavItem[];
}

type Project = {
    id: number;
    title: string;
    description: string;
    link?: string;
    imageUrl: string;
    tags: string[];
};

type Todo = {
    userId: number;
    project: number;
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    status?: string;
};  

type TodoSampleProps = {
    params: {
      slug: number;
      userId: number;
      id: number;
      title: string;
      completed: boolean;
      status?: string;
    };
  };

export type { UserProps, NavItem, Project, Todo, TodoSampleProps };

export enum DataTypes {
    project = 'project',
    sprint = 'sprint',
    retrospective = 'retrospective',
    group = 'group',
    task = 'task',
    subtask = 'subtask',
}
export enum TaskStatus {
    opened = 'opened',
    inprogress = 'inprogress',
    inreview = 'inreview',
    intest = 'intest',
    pending = 'pending',
    blocked = 'blocked',
    completed = 'completed',
    rejected = 'rejected',
    accepted = 'accepted',
    abandoned = 'abandoned',
    reopened = 'reopened',
    archived = 'archived',
}
export enum TaskPriority {
    low = 'low',
    medium = 'medium',
    high = 'high',
    critical = 'critical',
}
export enum TaskTags {
    meeting = 'meeting',
    documentation = 'documentation',
    design = 'design',
    development = 'development',
    testing = 'testing',
    deployment = 'deployment',
    maintenance = 'maintenance',
    bugfix = 'bugfix',
    feature = 'feature',
    improvement = 'improvement',
    refactoring = 'refactoring',
    research = 'research',
    planning = 'planning',
    analysis = 'analysis',
    review = 'review',
    feedback = 'feedback',
    support = 'support', 
}
export enum UserRoles {
    superadmin = 'superadmin',
    admin = 'admin',
    user = 'user',
    guest = 'guest',
}
// FormState is used to manage error messages
export interface FormState {
    message: string;
    errors: Record<string, string | string[]>;
    isError: boolean;
}