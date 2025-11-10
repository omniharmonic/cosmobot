import { Client } from '@notionhq/client';
import type { NotionResource, CivicSector, InnovationDomain, Archetype } from '@/types';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Database IDs from environment variables
export const DATABASES = {
  CIVIC_SECTORS: process.env.NOTION_CIVIC_SECTORS_DB!,
  INNOVATION_DOMAINS: process.env.NOTION_INNOVATION_DOMAINS_DB!,
  RESOURCES: process.env.NOTION_RESOURCES_DB!,
} as const;

/**
 * Search for resources based on criteria
 */
export async function searchResources(params: {
  civicSectors?: string[];
  innovationDomains?: string[];
  archetypes?: Archetype[];
  resourceTypes?: string[];
  query?: string;
  limit?: number;
}): Promise<NotionResource[]> {
  const { civicSectors, innovationDomains, archetypes, resourceTypes, query, limit = 10 } = params;

  // Fallback to mock data if Notion is not configured
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_RESOURCES_DB) {
    console.log('Notion not configured, using mock resources');
    return getMockResources(params);
  }

  try {
    // Build Notion filter
    const filters: any[] = [];

    // Only include published resources
    filters.push({
      property: 'Status',
      select: { equals: 'Published' }
    });

    // Filter by civic sectors
    if (civicSectors?.length) {
      filters.push({
        or: civicSectors.map(sector => ({
          property: 'Civic Sectors',
          multi_select: { contains: sector }
        }))
      });
    }

    // Filter by innovation domains
    if (innovationDomains?.length) {
      filters.push({
        or: innovationDomains.map(domain => ({
          property: 'Innovation Domains',
          multi_select: { contains: domain }
        }))
      });
    }

    // Filter by archetype relevance
    if (archetypes?.length) {
      filters.push({
        or: archetypes.map(archetype => ({
          property: 'Archetype Relevance',
          multi_select: { contains: capitalizeArchetype(archetype) }
        }))
      });
    }

    // Filter by resource type
    if (resourceTypes?.length) {
      filters.push({
        or: resourceTypes.map(type => ({
          property: 'Type',
          select: { equals: type }
        }))
      });
    }

    // Build query parameters
    const queryParams: any = {
      database_id: DATABASES.RESOURCES,
      page_size: limit,
      sorts: [
        { property: 'Title', direction: 'ascending' }
      ]
    };

    // Add filters if any exist
    if (filters.length > 0) {
      queryParams.filter = filters.length === 1 ? filters[0] : { and: filters };
    }

    // @ts-ignore - Temporary fix for TypeScript issue
    const response = await notion.databases.query(queryParams);

    let resources = response.results.map(parseResourcePage);

    // Apply text search filter if provided
    if (query) {
      const queryLower = query.toLowerCase();
      resources = resources.filter((resource: NotionResource) =>
        resource.title.toLowerCase().includes(queryLower) ||
        resource.description.toLowerCase().includes(queryLower) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(queryLower))
      );
    }

    return resources;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error searching Notion resources:', errorMessage);
    // Fall back to mock resources on error
    console.log('Falling back to mock resources due to Notion error');
    return getMockResources(params);
  }
}

/**
 * Mock resources for testing when Notion is not available
 */
function getMockResources(params: {
  civicSectors?: string[];
  innovationDomains?: string[];
  archetypes?: Archetype[];
  resourceTypes?: string[];
  query?: string;
  limit?: number;
}): NotionResource[] {
  const { civicSectors, innovationDomains, archetypes, limit = 10 } = params;

  const mockResources: NotionResource[] = [
    {
      id: 'mock-1',
      title: 'Regenerative Economics Framework',
      description: 'A comprehensive guide to building economic systems that regenerate rather than extract value from communities and ecosystems.',
      url: 'https://opencivics.com/resources/regenerative-economics',
      type: 'pattern',
      civic_sectors: ['economics', 'environment'],
      innovation_domains: ['regenerative finance', 'collective intelligence'],
      archetype_relevance: ['allies', 'organizers'],
      status: 'published',
      notion_page_id: 'mock-notion-1',
    },
    {
      id: 'mock-2',
      title: 'Blockchain Governance Toolkit',
      description: 'Tools and protocols for implementing transparent, decentralized governance using blockchain technology.',
      url: 'https://opencivics.com/resources/blockchain-governance',
      type: 'protocol',
      civic_sectors: ['governance', 'technology'],
      innovation_domains: ['blockchain', 'network governance'],
      archetype_relevance: ['innovators', 'organizers'],
      status: 'published',
      notion_page_id: 'mock-notion-2',
    },
    {
      id: 'mock-3',
      title: 'Community Organizing Playbook',
      description: 'Best practices for building and coordinating grassroots movements for civic change.',
      url: 'https://opencivics.com/resources/community-organizing',
      type: 'playbook',
      civic_sectors: ['community', 'governance'],
      innovation_domains: ['collective intelligence', 'network organizing'],
      archetype_relevance: ['organizers', 'allies'],
      status: 'published',
      notion_page_id: 'mock-notion-3',
    },
    {
      id: 'mock-4',
      title: 'Civic Technology Funding Guide',
      description: 'Resources for finding and securing funding for civic innovation projects and social impact technology.',
      url: 'https://opencivics.com/resources/civic-tech-funding',
      type: 'pattern',
      civic_sectors: ['technology', 'economics'],
      innovation_domains: ['civic tech', 'impact investing'],
      archetype_relevance: ['patrons', 'innovators'],
      status: 'published',
      notion_page_id: 'mock-notion-4',
    },
    {
      id: 'mock-5',
      title: 'Climate Action Network Model',
      description: 'Framework for building resilient networks to address climate change through coordinated local action.',
      url: 'https://opencivics.com/resources/climate-action-networks',
      type: 'civic_stack',
      civic_sectors: ['environment', 'community'],
      innovation_domains: ['climate tech', 'network coordination'],
      archetype_relevance: ['organizers', 'allies'],
      status: 'published',
      notion_page_id: 'mock-notion-5',
    },
  ];

  // Filter by archetype relevance
  let filteredResources = mockResources;
  if (archetypes?.length) {
    filteredResources = filteredResources.filter(resource =>
      archetypes.some(archetype => resource.archetype_relevance.includes(archetype))
    );
  }

  // Filter by civic sectors
  if (civicSectors?.length) {
    filteredResources = filteredResources.filter(resource =>
      civicSectors.some(sector => resource.civic_sectors.includes(sector))
    );
  }

  // Filter by innovation domains
  if (innovationDomains?.length) {
    filteredResources = filteredResources.filter(resource =>
      innovationDomains.some(domain => resource.innovation_domains.includes(domain))
    );
  }

  return filteredResources.slice(0, limit);
}

/**
 * Get a specific resource by Notion page ID
 */
export async function getResource(pageId: string): Promise<NotionResource | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    return parseResourcePage(page);
  } catch (error) {
    console.error('Error getting Notion resource:', error);
    return null;
  }
}

/**
 * Get all civic sectors
 */
export async function getCivicSectors(): Promise<CivicSector[]> {
  try {
    const response = await (notion.databases as any).query({
      database_id: DATABASES.CIVIC_SECTORS,
      sorts: [{ property: 'Name', direction: 'ascending' }]
    });

    return response.results.map((page: any) => ({
      value: getProperty(page, 'Name', 'title'),
      label: getProperty(page, 'Name', 'title'),
      description: getProperty(page, 'Description', 'rich_text'),
    }));
  } catch (error) {
    console.error('Error getting civic sectors:', error);
    // Return default sectors if Notion fails
    return getDefaultCivicSectors();
  }
}

/**
 * Get all innovation domains
 */
export async function getInnovationDomains(): Promise<InnovationDomain[]> {
  try {
    const response = await (notion.databases as any).query({
      database_id: DATABASES.INNOVATION_DOMAINS,
      sorts: [{ property: 'Title', direction: 'ascending' }]
    });

    return response.results.map((page: any) => ({
      value: getProperty(page, 'Title', 'title'),
      label: getProperty(page, 'Title', 'title'),
      description: getProperty(page, 'Description', 'rich_text'),
      thumbnail: getProperty(page, 'Thumbnail', 'files')?.[0]?.file?.url,
    }));
  } catch (error) {
    console.error('Error getting innovation domains:', error);
    // Return default domains if Notion fails
    return getDefaultInnovationDomains();
  }
}

/**
 * Get resources by archetype
 */
export async function getResourcesByArchetype(archetype: Archetype): Promise<NotionResource[]> {
  return searchResources({
    archetypes: [archetype],
    limit: 20
  });
}

/**
 * Get featured resources (top-rated or recently updated)
 */
export async function getFeaturedResources(limit: number = 6): Promise<NotionResource[]> {
  try {
    const response = await (notion.databases as any).query({
      database_id: DATABASES.RESOURCES,
      filter: {
        and: [
          { property: 'Status', select: { equals: 'Published' } },
          // Add featured filter if you have a Featured property
          // { property: 'Featured', checkbox: { equals: true } }
        ]
      },
      sorts: [
        { property: 'Title', direction: 'ascending' }
      ],
      page_size: limit
    });

    return response.results.map(parseResourcePage);
  } catch (error) {
    console.error('Error getting featured resources:', error);
    return [];
  }
}

/**
 * Search resources by text query
 */
export async function searchResourcesByText(query: string, limit: number = 10): Promise<NotionResource[]> {
  return searchResources({ query, limit });
}

/**
 * Parse a Notion page into a NotionResource
 */
function parseResourcePage(page: any): NotionResource {
  return {
    id: page.id.replace(/-/g, ''),
    notion_page_id: page.id,
    title: getProperty(page, 'Title', 'title'),
    description: getProperty(page, 'Description', 'rich_text'),
    type: getProperty(page, 'Type', 'select') as any,
    civic_sectors: getProperty(page, 'Civic Sectors', 'multi_select'),
    innovation_domains: getProperty(page, 'Innovation Domains', 'multi_select'),
    archetype_relevance: getProperty(page, 'Archetype Relevance', 'multi_select')?.map((a: string) =>
      a.toLowerCase() as Archetype
    ),
    tags: getProperty(page, 'Tags', 'multi_select'),
    url: page.url,
    status: getProperty(page, 'Status', 'select') as any,
  };
}

/**
 * Extract property value from Notion page
 */
function getProperty(page: any, propertyName: string, type: string): any {
  const property = page.properties?.[propertyName];
  if (!property) return null;

  switch (type) {
    case 'title':
      return property.title?.[0]?.plain_text || '';

    case 'rich_text':
      return property.rich_text?.map((rt: any) => rt.plain_text).join('') || '';

    case 'select':
      return property.select?.name || null;

    case 'multi_select':
      return property.multi_select?.map((ms: any) => ms.name) || [];

    case 'url':
      return property.url || null;

    case 'checkbox':
      return property.checkbox || false;

    case 'files':
      return property.files || [];

    case 'number':
      return property.number || null;

    case 'date':
      return property.date?.start || null;

    default:
      return null;
  }
}

/**
 * Capitalize archetype for Notion property matching
 */
function capitalizeArchetype(archetype: Archetype): string {
  return archetype.charAt(0).toUpperCase() + archetype.slice(1);
}

/**
 * Default civic sectors (fallback if Notion is unavailable)
 */
function getDefaultCivicSectors(): CivicSector[] {
  return [
    { value: 'governance', label: 'Governance & Political Systems', description: 'Decision-making, policy, participatory governance' },
    { value: 'civic_engagement', label: 'Civic Engagement & Participation', description: 'Assemblies, dialogue, collective action' },
    { value: 'justice', label: 'Justice & Legal Systems', description: 'Fairness, accountability, restorative justice' },
    { value: 'education', label: 'Educational & Learning Systems', description: 'Lifelong learning, civic literacy, open knowledge' },
    { value: 'environment', label: 'Environmental & Sustainability', description: 'Regeneration, ecosystems, biodiversity, stewardship' },
    { value: 'economy', label: 'Economic & Resource Sharing', description: 'Cooperation, mutual aid, shared wealth' },
    { value: 'health', label: 'Health & Well-Being', description: 'Physical, mental, social health and care' },
    { value: 'transportation', label: 'Transportation & Mobility', description: 'Equitable, sustainable movement systems' },
    { value: 'culture', label: 'Cultural & Creative Systems', description: 'Art, storytelling, ritual, shared meaning' },
    { value: 'security', label: 'Security & Safety', description: 'Care, preparedness, mutual responsibility' },
    { value: 'technology', label: 'Digital & Technological Systems', description: 'Ethical tech, digital infrastructure' },
    { value: 'media', label: 'Information & Media Systems', description: 'Open journalism, collective sensemaking' }
  ];
}

/**
 * Default innovation domains (fallback if Notion is unavailable)
 */
function getDefaultInnovationDomains(): InnovationDomain[] {
  return [
    { value: 'network_governance', label: 'Network Governance', description: 'Decentralized coordination through shared principles' },
    { value: 'bioregional', label: 'Bioregional Coordination', description: 'Place-based governance aligned with ecosystems' },
    { value: 'open_protocols', label: 'Open Protocols', description: 'Shared standards for interoperability' },
    { value: 'digital_infrastructure', label: 'Digital Public Infrastructure', description: 'Commons-based digital systems (identity, data, payments)' },
    { value: 'knowledge_commoning', label: 'Knowledge Commoning', description: 'Collective stewardship of information and research' },
    { value: 'capital_allocation', label: 'Capital Allocation', description: 'Redesigning value flows for regeneration' },
    { value: 'collective_intelligence', label: 'Collective Intelligence', description: 'Group thinking, learning, and decision-making' }
  ];
}

/**
 * Test Notion API connection
 */
export async function testNotionConnection(): Promise<boolean> {
  try {
    // Try to query one of the databases
    await (notion.databases as any).query({
      database_id: DATABASES.RESOURCES,
      page_size: 1
    });
    return true;
  } catch (error) {
    console.error('Notion connection test failed:', error);
    return false;
  }
}