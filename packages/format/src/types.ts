export type SpecStatus = 'draft' | 'approved' | 'deprecated';

export interface SpecFrontmatter {
  spec_version: '0.1';
  status: SpecStatus;
  component: {
    name: string;
    figma_key: string;
    figma_file: string;
    figma_node: string;
  };
  content_hash: string;
  extracted_at: string; // ISO 8601
  approved_by?: string;
}
