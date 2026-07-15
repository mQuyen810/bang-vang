"use client";

import { create } from "zustand";
import {
  getRolesApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
} from "@/api/role.api";
import type { Role } from "@/types/role";

interface RoleState {
  loading: boolean;
  roles: Role[];
  error: string | null;

  fetchRoles: (search?: string) => Promise<void>;
  deleteRole: (id: number) => Promise<void>;

  createRole: (payload: {
    name: string;
    permissions: string[];
  }) => Promise<void>;
  updateRole: (
    id: number,
    payload: { name: string; permissions: string[] },
  ) => Promise<void>;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  loading: false,
  roles: [],
  error: null,

  fetchRoles: async (search?: string) => {
    set({ loading: true, error: null });
    try {
      const res = await getRolesApi(search);
      // Map API response to parse permission_json into permissions array safely
      const mappedRoles = (res.data || []).map((r) => {
        let parsedPermissions: string[] = [];
        if (r.permission_json) {
          if (Array.isArray(r.permission_json)) {
            parsedPermissions = r.permission_json;
          } else if (typeof r.permission_json === "string") {
            try {
              parsedPermissions = JSON.parse(r.permission_json);
            } catch (e) {
              console.error("Failed to parse permission_json", e);
            }
          }
        }
        return { ...r, permissions: parsedPermissions };
      });
      set({ roles: mappedRoles, error: null });
    } catch {
      set({ error: "Failed to load roles" });
    } finally {
      set({ loading: false });
    }
  },

  createRole: async (payload) => {
    set({ loading: true, error: null });
    try {
      await createRoleApi(payload);
      await get().fetchRoles();
    } catch {
      set({ error: "Failed to create role" });
      throw new Error("Failed to create role");
    } finally {
      set({ loading: false });
    }
  },

  updateRole: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      await updateRoleApi(id, payload);
      await get().fetchRoles();
    } catch {
      set({ error: "Failed to update role" });
      throw new Error("Failed to update role");
    } finally {
      set({ loading: false });
    }
  },

  deleteRole: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await deleteRoleApi(id);
      set((s) => ({ roles: s.roles.filter((r) => r.id !== id) }));
    } catch {
      set({ error: "Failed to delete role" });
      throw new Error("Failed to delete role");
    } finally {
      set({ loading: false });
    }
  },
}));
