import type { Project, ContentArticle, PromptTemplate, GeneratedPrompt, PromptDraft } from '@/types';
import { INITIAL_PROJECT, INITIAL_CONTENT_CALENDAR } from './initial-data';
import { INITIAL_PROMPT_TEMPLATES } from '../prompt-engine/template-library';
import { supabase, authService } from '../auth/supabase-auth';
import type { SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  PROJECTS: 'seo_app_projects_v1',
  ACTIVE_PROJECT_ID: 'seo_app_active_project_id_v1',
  CALENDAR: 'seo_app_calendar_v1',
  TEMPLATES: 'seo_app_templates_v1',
  GENERATED_PROMPTS: 'seo_app_generated_prompts_v1',
  DRAFTS: 'seo_app_drafts_v1',
  SUPABASE_CONFIG: 'seo_app_supabase_config_v1',
};

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

class AppStore {
  private projects: Project[] = [];
  private activeProjectId: string = '';
  private calendar: ContentArticle[] = [];
  private templates: PromptTemplate[] = [];
  private generatedPrompts: GeneratedPrompt[] = [];
  private drafts: Record<string, PromptDraft> = {};
  private supabaseConfig: SupabaseConfig = {
    url: 'https://wycnbdiivphkpwsfwcvj.supabase.co',
    anonKey: '',
    isConnected: true,
  };
  private supabaseClient: SupabaseClient | null = supabase;
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;
    this.supabaseClient = supabase;

    if (typeof window === 'undefined') {
      this.projects = [];
      this.activeProjectId = '';
      this.calendar = [];
      this.templates = [...INITIAL_PROMPT_TEMPLATES];
      this.generatedPrompts = [];
      this.isInitialized = true;
      return;
    }

    try {
      // 1. Load Projects
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (savedProjects !== null) {
        try {
          const parsed = JSON.parse(savedProjects);
          this.projects = Array.isArray(parsed) ? parsed : [];
        } catch {
          this.projects = [];
        }
      } else {
        this.projects = [{ ...INITIAL_PROJECT }];
        this.saveProjectsToStorage();
      }

      // 2. Load Active Project ID
      const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID);
      if (savedActiveId && this.projects.some(p => p.id === savedActiveId)) {
        this.activeProjectId = savedActiveId;
      } else {
        this.activeProjectId = this.projects[0]?.id || '';
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, this.activeProjectId);
        }
      }

      // 3. Load Calendar
      const savedCalendar = localStorage.getItem(STORAGE_KEYS.CALENDAR);
      if (savedCalendar !== null) {
        try {
          const parsed = JSON.parse(savedCalendar);
          this.calendar = Array.isArray(parsed)
            ? parsed.map((art: any) => {
                // Ensure initial sample articles (art-001 to art-090) always belong to INITIAL_PROJECT
                const isSampleArticle = typeof art?.id === 'string' && /^art-\d+$/.test(art.id);
                return {
                  id: art?.id || generateUUID(),
                  project_id: isSampleArticle ? INITIAL_PROJECT.id : (art?.project_id || INITIAL_PROJECT.id),
                  day: String(art?.day || 'Hari 01'),
                  time_slot: String(art?.time_slot || 'Pagi'),
                  content_cluster: String(art?.content_cluster || 'Umum'),
                  title: String(art?.title || 'Judul Konten'),
                  primary_keyword: String(art?.primary_keyword || ''),
                  secondary_keywords: Array.isArray(art?.secondary_keywords)
                    ? art.secondary_keywords
                    : String(art?.secondary_keywords || '').split(',').map((s: string) => s.trim()).filter(Boolean),
                  search_volume: Number(art?.search_volume || 0),
                  competition: String(art?.competition || 'Low') as any,
                  journey_stage: String(art?.journey_stage || 'TOFU') as any,
                  content_format: String(art?.content_format || 'Panduan Lengkap'),
                  cta: String(art?.cta || 'Konsultasi Sekarang'),
                  slug: String(art?.slug || '/blog/artikel'),
                  status: art?.status || 'Draft',
                  created_at: art?.created_at || new Date().toISOString(),
                  updated_at: art?.updated_at || new Date().toISOString(),
                };
              })
            : [];
        } catch {
          this.calendar = [];
        }
      } else {
        this.calendar = [...INITIAL_CONTENT_CALENDAR];
        this.saveCalendarToStorage();
      }

      // 4. Load Templates
      const savedTemplates = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (savedTemplates) {
        this.templates = JSON.parse(savedTemplates);
      } else {
        this.templates = [...INITIAL_PROMPT_TEMPLATES];
        this.saveTemplatesToStorage();
      }

      // 5. Load Generated Prompts
      const savedPrompts = localStorage.getItem(STORAGE_KEYS.GENERATED_PROMPTS);
      if (savedPrompts) {
        this.generatedPrompts = JSON.parse(savedPrompts);
      } else {
        this.generatedPrompts = [];
        this.saveGeneratedPromptsToStorage();
      }

      // 6. Load Drafts
      const savedDrafts = localStorage.getItem(STORAGE_KEYS.DRAFTS);
      if (savedDrafts) {
        this.drafts = JSON.parse(savedDrafts);
      }

      // Cloud sync is triggered manually via "Sync Cloud" button only
      // No automatic network requests on page load for instant responsiveness
    } catch (e) {
      console.error('Failed to initialize local storage:', e);
    }

    this.isInitialized = true;
  }

  // --- Persistence Helpers ---
  private saveProjectsToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
    }
  }

  private saveCalendarToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(this.calendar));
    }
  }

  private saveTemplatesToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(this.templates));
    }
  }

  private saveGeneratedPromptsToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GENERATED_PROMPTS, JSON.stringify(this.generatedPrompts));
    }
  }

  private saveDraftsToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(this.drafts));
    }
  }

  private saveSupabaseConfigToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(this.supabaseConfig));
    }
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private isFetchingProjects = false;
  private isFetchingCalendar = false;
  private isFetchingTemplates = false;
  private isFetchingPrompts = false;
  private lastProjectsFetch = 0;
  private lastCalendarFetch = 0;

  // --- Project Methods ---
  public getProjects(): Project[] {
    this.init();
    return [...this.projects];
  }

  public async fetchProjectsFromSupabase(force = false): Promise<Project[]> {
    this.init();
    if (!this.supabaseClient) return this.getProjects();

    const now = Date.now();
    if (!force && (this.isFetchingProjects || (now - this.lastProjectsFetch < 30000))) {
      return this.getProjects();
    }

    this.isFetchingProjects = true;

    try {
      const { data, error } = await this.supabaseClient
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      this.lastProjectsFetch = Date.now();

      if (error) {
        console.warn('Fetch projects from Supabase:', error.message);
        return this.getProjects();
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const fetched: Project[] = data.map((p: any) => ({
          id: String(p.id),
          name: String(p.name || 'Project'),
          website_url: String(p.website_url || ''),
          business_name: String(p.business_name || p.name || ''),
          industry: String(p.industry || 'Umum'),
          description: String(p.description || ''),
          primary_location: String(p.primary_location || 'Indonesia'),
          default_language: String(p.default_language || 'Bahasa Indonesia'),
          default_tone: String(p.default_tone || 'Profesional & Informatif'),
          default_cta: String(p.default_cta || 'Konsultasi via WhatsApp'),
          created_at: p.created_at || new Date().toISOString(),
          updated_at: p.updated_at || new Date().toISOString(),
        }));

        const isChanged = JSON.stringify(this.projects) !== JSON.stringify(fetched);
        if (isChanged) {
          this.projects = fetched;
          this.saveProjectsToStorage();
          this.notify();
        }
        return fetched;
      }
    } catch (err) {
      console.warn('Error fetching live projects from Supabase:', err);
    } finally {
      this.isFetchingProjects = false;
    }

    return this.getProjects();
  }

  public getActiveProject(): Project | null {
    this.init();
    const found = this.projects.find(p => p.id === this.activeProjectId);
    return found || this.projects[0] || null;
  }

  public setActiveProject(id: string) {
    this.init();
    if (this.projects.some(p => p.id === id)) {
      this.activeProjectId = id;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, id);
      }
      this.notify();
    }
  }

  public setActiveProjectId(id: string) {
    this.setActiveProject(id);
  }

  public createProject(projectData: Partial<Project>): Project {
    this.init();
    const projectId = generateUUID();
    const newProject: Project = {
      id: projectId,
      name: projectData.name || 'Project Baru',
      website_url: projectData.website_url || '',
      business_name: projectData.business_name || '',
      industry: projectData.industry || 'Umum',
      description: projectData.description || '',
      primary_location: projectData.primary_location || 'Indonesia',
      default_language: projectData.default_language || 'Bahasa Indonesia',
      default_tone: projectData.default_tone || 'Profesional & Informatif',
      default_cta: projectData.default_cta || 'Hubungi Kami via WhatsApp',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.projects.push(newProject);
    this.activeProjectId = newProject.id;
    this.saveProjectsToStorage();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, this.activeProjectId);
    }
    this.notify();

    // Auto-sync Project to Supabase
    this.syncProjectToSupabaseAsync(newProject);

    return newProject;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | null {
    this.init();
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;

    this.projects[idx] = {
      ...this.projects[idx]!,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveProjectsToStorage();
    this.notify();

    if (this.projects[idx]) {
      this.syncProjectToSupabaseAsync(this.projects[idx]!);
    }

    return this.projects[idx]!;
  }

  public async deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
    this.init();
    const projectToDelete = this.projects.find(p => p.id === id);

    // 1. Remove from local store & localStorage
    this.projects = this.projects.filter(p => p.id !== id);
    if (this.activeProjectId === id) {
      this.activeProjectId = this.projects[0]?.id || '';
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, this.activeProjectId);
      }
    }

    // Clean up calendar articles for this project locally
    this.calendar = this.calendar.filter(a => a.project_id !== id);
    this.saveCalendarToStorage();

    // Clean up prompts for this project locally
    this.generatedPrompts = this.generatedPrompts.filter(p => p.project_id !== id);
    this.saveGeneratedPromptsToStorage();

    this.saveProjectsToStorage();
    this.notify();

    // 2. Direct Sync delete to Supabase Cloud Database
    if (this.supabaseClient) {
      try {
        let dbProjectId: string | null = isValidUUID(id) ? id : null;

        // If not a valid UUID, search by project name in Supabase
        if (!dbProjectId && projectToDelete?.name) {
          const { data: found } = await this.supabaseClient
            .from('projects')
            .select('id')
            .eq('name', projectToDelete.name)
            .maybeSingle();
          if (found?.id && isValidUUID(found.id)) {
            dbProjectId = found.id;
          }
        }

        if (dbProjectId) {
          // Delete child records first to prevent foreign key constraint violations
          const { error: promptErr } = await this.supabaseClient
            .from('generated_prompts')
            .delete()
            .eq('project_id', dbProjectId);
          if (promptErr) {
            console.warn('Supabase delete generated_prompts warning:', promptErr.message);
          }

          const { error: calErr } = await this.supabaseClient
            .from('content_calendar')
            .delete()
            .eq('project_id', dbProjectId);
          if (calErr) {
            console.warn('Supabase delete content_calendar warning:', calErr.message);
          }

          const { error: projErr } = await this.supabaseClient
            .from('projects')
            .delete()
            .eq('id', dbProjectId);

          if (projErr) {
            console.error('Supabase delete project error:', projErr.message);
            return { success: false, error: projErr.message };
          }
        } else if (projectToDelete?.name) {
          // Fallback delete by name if no UUID matched
          await this.supabaseClient
            .from('projects')
            .delete()
            .eq('name', projectToDelete.name);
        }

        return { success: true };
      } catch (err: any) {
        console.error('Error deleting project from Supabase:', err);
        return { success: false, error: err?.message || 'Gagal menghapus project dari Supabase' };
      }
    }

    return { success: true };
  }

  // --- Calendar Methods ---
  public getCalendar(projectId?: string): ContentArticle[] {
    this.init();
    const targetProjId = projectId || this.activeProjectId;
    return this.calendar.filter(art => art.project_id === targetProjId);
  }

  public getTemplates(): PromptTemplate[] {
    this.init();
    if (!this.templates || this.templates.length === 0) {
      this.templates = [...INITIAL_PROMPT_TEMPLATES];
      this.saveTemplatesToStorage();
    }
    return [...this.templates];
  }

  public async fetchCalendarFromSupabase(projectId?: string, force = false): Promise<ContentArticle[]> {
    this.init();
    const targetProjId = projectId || this.activeProjectId;

    if (!this.supabaseClient) {
      return this.getCalendar(targetProjId);
    }

    const now = Date.now();
    if (!force && (this.isFetchingCalendar || (now - this.lastCalendarFetch < 30000))) {
      return this.getCalendar(targetProjId);
    }

    this.isFetchingCalendar = true;

    try {
      const { data, error } = await this.supabaseClient
        .from('content_calendar')
        .select('*')
        .order('created_at', { ascending: true });

      this.lastCalendarFetch = Date.now();

      if (error) {
        console.warn('Supabase fetch calendar:', error.message);
        return this.getCalendar(targetProjId);
      }

      if (data && Array.isArray(data)) {
        const fetched: ContentArticle[] = data.map((row: any) => ({
          id: String(row.id),
          project_id: String(row.project_id || INITIAL_PROJECT.id),
          day: String(row.day || 'Hari 01'),
          time_slot: String(row.time_slot || '09:00'),
          content_cluster: String(row.content_cluster || 'Umum'),
          title: String(row.title || 'Artikel Tanpa Judul'),
          primary_keyword: String(row.primary_keyword || ''),
          secondary_keywords: String(row.secondary_keywords || ''),
          search_volume: String(row.search_volume || '> 1,000'),
          competition: String(row.competition || 'Menengah'),
          journey_stage: (row.journey_stage as any) || 'TOFU',
          content_format: String(row.content_format || 'Artikel Standar'),
          cta: String(row.cta || 'Hubungi Kami'),
          slug: String(row.slug || '/blog/artikel'),
          status: (row.status as any) || 'Draft',
          created_at: row.created_at || new Date().toISOString(),
          updated_at: row.updated_at || new Date().toISOString(),
        }));

        const isChanged = JSON.stringify(this.calendar) !== JSON.stringify(fetched);
        if (isChanged) {
          this.calendar = fetched;
          this.saveCalendarToStorage();
          this.notify();
        }
        return this.getCalendar(targetProjId);
      }
    } catch (err) {
      console.warn('Error fetching live calendar from Supabase:', err);
    } finally {
      this.isFetchingCalendar = false;
    }

    return this.getCalendar(targetProjId);
  }

  public getArticleById(id: string): ContentArticle | undefined {
    this.init();
    return this.calendar.find(art => art.id === id);
  }

  /**
   * Adds articles and automatically syncs them straight into Supabase database in real-time
   */
  public addArticles(newArticles: Partial<ContentArticle>[]): ContentArticle[] {
    this.init();
    const activeProj = this.getActiveProject();
    const targetProjId = activeProj?.id || this.activeProjectId || generateUUID();

    const added: ContentArticle[] = newArticles.map((art, idx) => ({
      id: isValidUUID(String(art.id || '')) ? String(art.id) : generateUUID(),
      project_id: targetProjId,
      day: String(art.day || 'Hari 01'),
      time_slot: String(art.time_slot || '09:00'),
      content_cluster: String(art.content_cluster || 'Umum'),
      title: String(art.title || 'Artikel Tanpa Judul'),
      primary_keyword: String(art.primary_keyword || ''),
      secondary_keywords: String(art.secondary_keywords || ''),
      search_volume: String(art.search_volume || '> 1,000'),
      competition: String(art.competition || 'Menengah'),
      journey_stage: String(art.journey_stage || 'TOFU'),
      content_format: String(art.content_format || 'Artikel Standar'),
      cta: String(art.cta || 'Hubungi Kami'),
      slug: String(art.slug || '/blog/artikel'),
      status: art.status || 'Draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    this.calendar = [...this.calendar, ...added];
    this.saveCalendarToStorage();
    this.notify();

    // AUTOMATIC REAL-TIME SYNC TO SUPABASE (No manual steps needed!)
    if (activeProj) {
      this.syncArticlesToSupabaseAsync(added, activeProj);
    }

    return added;
  }

  public updateArticle(id: string, updates: Partial<ContentArticle>): ContentArticle | null {
    this.init();
    const idx = this.calendar.findIndex(a => a.id === id);
    if (idx === -1) return null;

    this.calendar[idx] = {
      ...this.calendar[idx]!,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveCalendarToStorage();
    this.notify();

    // Sync update to Supabase
    if (this.supabaseClient && isValidUUID(id)) {
      this.supabaseClient
        .from('content_calendar')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .then(() => {})
        .catch(console.error);
    }

    return this.calendar[idx]!;
  }

  public async deleteArticle(id: string): Promise<{ success: boolean; error?: string }> {
    this.init();
    this.calendar = this.calendar.filter(a => a.id !== id);
    this.saveCalendarToStorage();
    this.notify();

    // Sync delete to Supabase
    if (this.supabaseClient && isValidUUID(id)) {
      try {
        // Delete linked generated prompts first
        await this.supabaseClient
          .from('generated_prompts')
          .delete()
          .eq('content_id', id);

        const { error } = await this.supabaseClient
          .from('content_calendar')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase delete article error:', error.message);
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        console.error('Error deleting article from Supabase:', err);
        return { success: false, error: err?.message };
      }
    }
    return { success: true };
  }

  public async clearCalendar(projectId?: string): Promise<{ success: boolean; error?: string }> {
    this.init();
    const targetProjId = projectId || this.activeProjectId;
    this.calendar = this.calendar.filter(a => a.project_id !== targetProjId);
    this.saveCalendarToStorage();
    this.notify();

    // Sync clear to Supabase
    if (this.supabaseClient && isValidUUID(targetProjId)) {
      try {
        // Delete linked generated prompts for this project
        await this.supabaseClient
          .from('generated_prompts')
          .delete()
          .eq('project_id', targetProjId);

        const { error } = await this.supabaseClient
          .from('content_calendar')
          .delete()
          .eq('project_id', targetProjId);

        if (error) {
          console.error('Supabase clear calendar error:', error.message);
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        console.error('Error clearing calendar from Supabase:', err);
        return { success: false, error: err?.message };
      }
    }
    return { success: true };
  }

  // --- Template Methods ---
  public async fetchTemplatesFromSupabase(): Promise<PromptTemplate[]> {
    this.init();
    if (!this.supabaseClient) return this.getTemplates();

    try {
      const { data, error } = await this.supabaseClient
        .from('prompt_templates')
        .select('*')
        .order('number', { ascending: true });

      if (error) {
        console.warn('Fetch templates error from Supabase:', error);
        return this.getTemplates();
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const fetched: PromptTemplate[] = data.map((t: any) => ({
          id: String(t.id || `tpl-${t.number}`),
          number: Number(t.number),
          name: String(t.name),
          category: String(t.category || 'General'),
          description: String(t.description || ''),
          template_markdown: String(t.template_markdown || ''),
          input_schema: t.input_schema || {},
          version: String(t.version || '1.0'),
          is_active: t.is_active ?? true,
          created_at: t.created_at || new Date().toISOString(),
          updated_at: t.updated_at || new Date().toISOString(),
        }));

        this.templates = fetched;
        this.saveTemplatesToStorage();
        this.notify();
        return fetched;
      }
    } catch (err) {
      console.warn('Error fetching live templates from Supabase:', err);
    }

    return this.getTemplates();
  }

  public getTemplateById(id: string): PromptTemplate | undefined {
    this.init();
    return this.templates.find(t => t.id === id || String(t.number) === id);
  }

  public createTemplate(templateData: Partial<PromptTemplate>): PromptTemplate {
    this.init();
    const nextNumber = this.templates.length > 0 ? Math.max(...this.templates.map(t => t.number)) + 1 : 4;
    const newTemplate: PromptTemplate = {
      id: `tpl-${String(nextNumber).padStart(2, '0')}`,
      number: nextNumber,
      name: templateData.name || `Custom Template #${nextNumber}`,
      category: templateData.category || 'SEO Strategy',
      description: templateData.description || 'Template prompt kustom.',
      template_markdown: templateData.template_markdown || '',
      input_schema: templateData.input_schema || {},
      version: '1.0',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.templates.push(newTemplate);
    this.saveTemplatesToStorage();
    this.notify();

    // Auto-sync template to Supabase
    if (this.supabaseClient) {
      this.supabaseClient
        .from('prompt_templates')
        .upsert([{
          number: newTemplate.number,
          name: newTemplate.name,
          category: newTemplate.category,
          description: newTemplate.description,
          template_markdown: newTemplate.template_markdown,
          input_schema: newTemplate.input_schema,
          version: newTemplate.version,
          is_active: newTemplate.is_active,
        }], { onConflict: 'number' } as any)
        .then(() => {})
        .catch(console.error);
    }

    return newTemplate;
  }

  // --- Generated Prompts Methods ---
  public getGeneratedPrompts(projectId?: string): GeneratedPrompt[] {
    this.init();
    if (!projectId) return [...this.generatedPrompts];
    return this.generatedPrompts.filter(p => p.project_id === projectId);
  }

  public async fetchGeneratedPromptsFromSupabase(): Promise<GeneratedPrompt[]> {
    this.init();
    if (!this.supabaseClient) return this.getGeneratedPrompts();

    try {
      const { data, error } = await this.supabaseClient
        .from('generated_prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Fetch generated prompts from Supabase error:', error);
        return this.getGeneratedPrompts();
      }

      if (data && Array.isArray(data)) {
        const fetched: GeneratedPrompt[] = data.map((p: any) => ({
          id: String(p.id),
          project_id: String(p.project_id || ''),
          content_id: p.content_id ? String(p.content_id) : undefined,
          template_id: p.template_id ? String(p.template_id) : undefined,
          template_number: Number(p.template_number || 4),
          template_name: String(p.template_name || 'SEO Prompt'),
          template_version: String(p.template_version || '1.0'),
          article_title: String(p.article_title || 'Untitled Article'),
          primary_keyword: String(p.primary_keyword || ''),
          input_data: p.input_data || {},
          field_sources: p.field_sources || {},
          generated_markdown: String(p.generated_markdown || ''),
          created_at: p.created_at || new Date().toISOString(),
          updated_at: p.updated_at || new Date().toISOString(),
        }));

        this.generatedPrompts = fetched;
        this.saveGeneratedPromptsToStorage();
        this.notify();
        return fetched;
      }
    } catch (err) {
      console.warn('Error fetching live generated prompts from Supabase:', err);
    }

    return this.getGeneratedPrompts();
  }

  public saveGeneratedPrompt(prompt: Omit<GeneratedPrompt, 'id' | 'created_at' | 'updated_at'>): GeneratedPrompt {
    this.init();
    const promptId = generateUUID();
    const newPrompt: GeneratedPrompt = {
      ...prompt,
      id: promptId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.generatedPrompts.unshift(newPrompt);
    this.saveGeneratedPromptsToStorage();

    if (prompt.content_id) {
      this.updateArticle(prompt.content_id, { status: 'Generated' });
    }

    this.notify();

    // Auto-sync to Supabase generated_prompts table
    this.syncGeneratedPromptToSupabaseAsync(newPrompt);

    return newPrompt;
  }

  public async deleteGeneratedPrompt(id: string): Promise<{ success: boolean; error?: string }> {
    this.init();
    this.generatedPrompts = this.generatedPrompts.filter(p => p.id !== id);
    this.saveGeneratedPromptsToStorage();
    this.notify();

    if (this.supabaseClient && isValidUUID(id)) {
      try {
        const { error } = await this.supabaseClient
          .from('generated_prompts')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase delete generated prompt error:', error.message);
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        console.error('Error deleting prompt from Supabase:', err);
        return { success: false, error: err?.message };
      }
    }
    return { success: true };
  }

  // --- Draft System Methods (PRD Section 72) ---
  public getDraft(projectId: string, templateId: string, contentId?: string): PromptDraft | undefined {
    this.init();
    const key = `${projectId}_${templateId}_${contentId || 'standalone'}`;
    return this.drafts[key];
  }

  public saveDraft(draft: PromptDraft) {
    this.init();
    const key = `${draft.project_id}_${draft.template_id}_${draft.content_id || 'standalone'}`;
    this.drafts[key] = {
      ...draft,
      updated_at: new Date().toISOString(),
    };
    this.saveDraftsToStorage();
  }

  public clearDraft(projectId: string, templateId: string, contentId?: string) {
    this.init();
    const key = `${projectId}_${templateId}_${contentId || 'standalone'}`;
    delete this.drafts[key];
    this.saveDraftsToStorage();
  }

  // --- Supabase Config & Sync ---
  private initSupabaseClient(url: string, key: string) {
    try {
      this.supabaseClient = createClient(url, key);
    } catch (e) {
      console.error('Supabase init failed:', e);
    }
  }

  public getSupabaseConfig(): SupabaseConfig {
    this.init();
    return { ...this.supabaseConfig };
  }

  public setSupabaseConfig(config: { url: string; anonKey: string }) {
    this.init();
    this.supabaseConfig = {
      url: config.url.trim(),
      anonKey: config.anonKey.trim(),
      isConnected: Boolean(config.url && config.anonKey),
    };
    this.saveSupabaseConfigToStorage();
    if (this.supabaseConfig.url && this.supabaseConfig.anonKey) {
      this.initSupabaseClient(this.supabaseConfig.url, this.supabaseConfig.anonKey);
    }
    this.notify();
  }

  /**
   * Background automatic sync for articles to Supabase
   */
  private async syncArticlesToSupabaseAsync(articles: ContentArticle[], project: Project) {
    if (!this.supabaseClient) return;
    const currentUser = (await this.supabaseClient.auth.getUser())?.data?.user;
    const currentUserId = currentUser?.id || undefined;

    try {
      // 1. Ensure project exists in Supabase
      let dbProjectId = project.id;
      if (!isValidUUID(dbProjectId)) {
        const { data: projData, error: projErr } = await this.supabaseClient
          .from('projects')
          .insert({
            user_id: currentUserId,
            name: project.name,
            website_url: project.website_url,
            business_name: project.business_name,
            industry: project.industry,
            description: project.description,
            primary_location: project.primary_location,
            default_language: project.default_language,
            default_tone: project.default_tone,
            default_cta: project.default_cta,
          })
          .select('id')
          .single();

        if (projErr && projErr.message?.includes('user_id')) {
          // Fallback if user_id column doesn't exist yet
          const { data: fallbackData } = await this.supabaseClient
            .from('projects')
            .insert({
              name: project.name,
              website_url: project.website_url,
              business_name: project.business_name,
              industry: project.industry,
              description: project.description,
              primary_location: project.primary_location,
              default_language: project.default_language,
              default_tone: project.default_tone,
              default_cta: project.default_cta,
            })
            .select('id')
            .single();
          if (fallbackData?.id) dbProjectId = fallbackData.id;
        } else if (projData?.id) {
          dbProjectId = projData.id;
        }
      } else {
        const { error: upsertErr } = await this.supabaseClient
          .from('projects')
          .upsert({
            id: project.id,
            user_id: currentUserId,
            name: project.name,
            website_url: project.website_url,
            business_name: project.business_name,
            industry: project.industry,
            description: project.description,
            primary_location: project.primary_location,
            default_language: project.default_language,
            default_tone: project.default_tone,
            default_cta: project.default_cta,
          });

        if (upsertErr && upsertErr.message?.includes('user_id')) {
          await this.supabaseClient
            .from('projects')
            .upsert({
              id: project.id,
              name: project.name,
              website_url: project.website_url,
              business_name: project.business_name,
              industry: project.industry,
              description: project.description,
              primary_location: project.primary_location,
              default_language: project.default_language,
              default_tone: project.default_tone,
              default_cta: project.default_cta,
            });
        }
      }

      // 2. Prepare article payloads with valid UUID project_id and user_id
      const payloads = articles.map(a => ({
        id: isValidUUID(a.id) ? a.id : undefined,
        user_id: currentUserId,
        project_id: dbProjectId,
        day: a.day,
        time_slot: a.time_slot,
        content_cluster: a.content_cluster,
        title: a.title,
        primary_keyword: a.primary_keyword,
        secondary_keywords: a.secondary_keywords,
        search_volume: a.search_volume,
        competition: a.competition,
        journey_stage: a.journey_stage,
        content_format: a.content_format,
        cta: a.cta,
        slug: a.slug,
        status: a.status,
      }));

      const { error } = await this.supabaseClient
        .from('content_calendar')
        .insert(payloads);

      if (error && error.message?.includes('user_id')) {
        // Fallback without user_id column
        const fallbackPayloads = payloads.map(({ user_id, ...rest }) => rest);
        await this.supabaseClient
          .from('content_calendar')
          .insert(fallbackPayloads);
      }
    } catch (err) {
      console.warn('Error during auto-sync to Supabase:', err);
    }
  }

  /**
   * Background automatic sync for projects to Supabase
   */
  private async syncProjectToSupabaseAsync(project: Project) {
    if (!this.supabaseClient) return;
    try {
      const currentUser = (await this.supabaseClient.auth.getUser())?.data?.user;
      const { error } = await this.supabaseClient
        .from('projects')
        .upsert({
          id: isValidUUID(project.id) ? project.id : undefined,
          user_id: currentUser?.id || undefined,
          name: project.name,
          website_url: project.website_url,
          business_name: project.business_name,
          industry: project.industry,
          description: project.description,
          primary_location: project.primary_location,
          default_language: project.default_language,
          default_tone: project.default_tone,
          default_cta: project.default_cta,
        });

      if (error && error.message?.includes('user_id')) {
        await this.supabaseClient
          .from('projects')
          .upsert({
            id: isValidUUID(project.id) ? project.id : undefined,
            name: project.name,
            website_url: project.website_url,
            business_name: project.business_name,
            industry: project.industry,
            description: project.description,
            primary_location: project.primary_location,
            default_language: project.default_language,
            default_tone: project.default_tone,
            default_cta: project.default_cta,
          });
      }
    } catch (err) {
      console.warn('Error auto-syncing project to Supabase:', err);
    }
  }

  /**
   * Background automatic sync for generated prompts to Supabase
   */
  private async syncGeneratedPromptToSupabaseAsync(prompt: GeneratedPrompt) {
    if (!this.supabaseClient) return;
    try {
      const currentUser = (await this.supabaseClient.auth.getUser())?.data?.user;
      const { error } = await this.supabaseClient
        .from('generated_prompts')
        .insert({
          id: isValidUUID(prompt.id) ? prompt.id : undefined,
          user_id: currentUser?.id || undefined,
          project_id: isValidUUID(prompt.project_id) ? prompt.project_id : undefined,
          content_id: prompt.content_id && isValidUUID(prompt.content_id) ? prompt.content_id : null,
          template_id: isValidUUID(String(prompt.template_id)) ? prompt.template_id : null,
          template_number: prompt.template_number,
          template_name: prompt.template_name,
          template_version: prompt.template_version,
          article_title: prompt.article_title,
          primary_keyword: prompt.primary_keyword,
          input_data: prompt.input_data,
          field_sources: prompt.field_sources,
          generated_markdown: prompt.generated_markdown,
        });

      if (error && error.message?.includes('user_id')) {
        await this.supabaseClient
          .from('generated_prompts')
          .insert({
            id: isValidUUID(prompt.id) ? prompt.id : undefined,
            project_id: isValidUUID(prompt.project_id) ? prompt.project_id : undefined,
            content_id: prompt.content_id && isValidUUID(prompt.content_id) ? prompt.content_id : null,
            template_id: isValidUUID(String(prompt.template_id)) ? prompt.template_id : null,
            template_number: prompt.template_number,
            template_name: prompt.template_name,
            template_version: prompt.template_version,
            article_title: prompt.article_title,
            primary_keyword: prompt.primary_keyword,
            input_data: prompt.input_data,
            field_sources: prompt.field_sources,
            generated_markdown: prompt.generated_markdown,
          });
      }
    } catch (err) {
      console.warn('Error auto-syncing generated prompt to Supabase:', err);
    }
  }

  public async syncAllToSupabase(): Promise<{ success: boolean; message: string }> {
    this.init();
    if (!this.supabaseClient) {
      return { success: false, message: 'Supabase client belum terinisialisasi. Periksa URL dan Anon Key.' };
    }

    try {
      // 1. Sync Templates
      const templatePayloads = this.templates.map(t => ({
        number: t.number,
        name: t.name,
        category: t.category,
        description: t.description,
        template_markdown: t.template_markdown,
        input_schema: t.input_schema || {},
        version: t.version || '1.0',
        is_active: t.is_active ?? true,
      }));

      await this.supabaseClient
        .from('prompt_templates')
        .upsert(templatePayloads, { onConflict: 'number' } as any);

      // 2. Sync Active Projects & Calendar
      for (const p of this.projects) {
        await this.syncArticlesToSupabaseAsync(this.calendar.filter(a => a.project_id === p.id), p);
      }

      return { success: true, message: 'Seluruh data Projects, Templates, dan Content Calendar berhasil di-upload ke Supabase!' };
    } catch (err: any) {
      console.error('Supabase sync error:', err);
      return { success: false, message: err?.message || 'Terjadi kesalahan saat sinkronisasi.' };
    }
  }

  public resetToSampleData() {
    this.projects = [INITIAL_PROJECT];
    this.activeProjectId = INITIAL_PROJECT.id;
    this.calendar = [...INITIAL_CONTENT_CALENDAR];
    this.templates = [...INITIAL_PROMPT_TEMPLATES];
    this.generatedPrompts = [];
    this.drafts = {};
    
    this.saveProjectsToStorage();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, this.activeProjectId);
    }
    this.saveCalendarToStorage();
    this.saveTemplatesToStorage();
    this.saveGeneratedPromptsToStorage();
    this.saveDraftsToStorage();
    this.notify();
  }
}

export const store = new AppStore();
