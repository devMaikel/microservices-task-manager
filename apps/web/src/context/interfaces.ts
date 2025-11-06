import type { ReactNode } from "react";

export interface AuthContextType {
	user: any;
	signUp: (email: string, name: string, password: string) => void;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => void;
}

export interface AuthProviderProps {
	children: ReactNode;
}

export interface IAuthResponse {
	accessToken: string;
	refreshToken: string;
	id: string;
	name: string;
	email: string;
}
