import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    flash: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Department {
    id: number;
    name: string;
    color: string;
    department_score: number;
    participants_count: number;
    participants: Participant[];
}

export interface Participant {
    id: number;
    name: string;
    order: string;
    department_id: number;
    department?: Department | null;
    last_game_result: boolean;
    pivot: GameParticipantPivot;
    games: Game[];
    result: {
        correct: number;
        incorrect: number;
        score: number;
    };
    deleted_at?: string | null;
}

interface GameParticipantPivot {
    is_correct: boolean;
    is_incorrect: boolean;
    game_id: number;
}

export interface Round {
    id: number;
    name: string;
    correct_points: number;
    incorrect_points: number;
    last_members_kicked: number;
    is_knocked_out: boolean;
}

export interface Game {
    id: number;
    name: string;
    round: Round;
    round_id: number;
    participants_count: number;
    participants: Participant[];
    pivot: GameParticipantPivot;
}
