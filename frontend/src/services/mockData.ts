// Mock data for development and demo purposes
import { Case, Proposition, Relationship } from '../types';

export const mockCases: Case[] = [
  {
    _id: '1',
    caseId: 'Kesavananda Bharati v. State of Kerala',
    summary: {
      Facts: 'A challenge to the constitutional validity of land reform laws in Kerala. The petitioner, a religious leader, challenged the Kerala Land Reforms Act arguing it violated fundamental rights.',
      Issues: 'Whether Parliament has unlimited power to amend the Constitution, including fundamental rights. Whether there exists a basic structure of the Constitution that cannot be amended.',
      Holding: 'The Supreme Court held that while Parliament has wide powers to amend the Constitution, it cannot alter the basic structure of the Constitution. This landmark judgment established the Basic Structure Doctrine.',
      Reasoning: 'The Court reasoned that the Constitution is founded on certain fundamental principles and values that form its basic structure. These include supremacy of the Constitution, republican and democratic form of government, secular character, separation of powers, and federal character.'
    },
    metadata: {
      court: 'Supreme Court of India',
      year: 1973,
      citation: 'AIR 1973 SC 1461',
      judges: ['S.M. Sikri', 'J.M. Shelat', 'A.N. Grover', 'P. Jaganmohan Reddy', 'H.R. Khanna', 'A.N. Ray', 'K.K. Mathew', 'M.H. Beg', 'S.N. Dwivedi', 'Y.V. Chandrachud', 'D.G. Palekar', 'K.S. Hegde', 'A.K. Mukherjea'],
      category: 'Constitutional Law'
    }
  },
  {
    _id: '2',
    caseId: 'Maneka Gandhi v. Union of India',
    summary: {
      Facts: 'The petitioner\'s passport was impounded by the Regional Passport Officer under Section 10(3)(c) of the Passports Act, 1967, in the interest of the general public. She challenged this action as it violated her fundamental rights.',
      Issues: 'Whether the right to travel abroad is part of personal liberty under Article 21. Whether procedure established by law must be just, fair and reasonable.',
      Holding: 'The Supreme Court held that the right to go abroad is part of personal liberty under Article 21. The procedure contemplated by Article 21 must be right, just and fair, not arbitrary, fanciful or oppressive.',
      Reasoning: 'The Court expanded the scope of Article 21 by reading Articles 14, 19, and 21 together. Any law depriving a person of personal liberty must not only prescribe a procedure but that procedure must be just, fair and reasonable.'
    },
    metadata: {
      court: 'Supreme Court of India',
      year: 1978,
      citation: 'AIR 1978 SC 597',
      judges: ['M.H. Beg', 'Y.V. Chandrachud', 'P.N. Bhagwati', 'N.L. Untwalia', 'P.S. Kailasam'],
      category: 'Constitutional Law'
    }
  },
  {
    _id: '3',
    caseId: 'Vishaka v. State of Rajasthan',
    summary: {
      Facts: 'A social worker was brutally gang-raped in Rajasthan. This case was filed as a PIL to address the absence of domestic law on sexual harassment of women at workplace.',
      Issues: 'Whether in the absence of domestic law, international conventions and norms can be enforced. What guidelines should be laid down to prevent sexual harassment of women at workplace.',
      Holding: 'The Supreme Court laid down detailed guidelines (Vishaka Guidelines) to prevent sexual harassment of women at workplace. These guidelines were to be followed until suitable legislation is enacted.',
      Reasoning: 'The Court held that in the absence of domestic law, international conventions not inconsistent with fundamental rights can be used. Gender equality includes protection from sexual harassment and right to work with dignity.'
    },
    metadata: {
      court: 'Supreme Court of India',
      year: 1997,
      citation: 'AIR 1997 SC 3011',
      judges: ['J.S. Verma', 'Sujata V. Manohar', 'B.N. Kirpal'],
      category: 'Women Rights'
    }
  },
  {
    _id: '4',
    caseId: 'I.R. Coelho v. State of Tamil Nadu',
    summary: {
      Facts: 'Challenge to various land reform and taxation laws placed in the Ninth Schedule of the Constitution, which provided immunity from judicial review.',
      Issues: 'Whether laws placed in Ninth Schedule are completely immune from judicial review. Whether such laws can violate the basic structure of the Constitution.',
      Holding: 'The Court held that post-Kesavananda Bharati, laws placed in Ninth Schedule can be subjected to judicial review if they violate basic structure. The immunity provided by Article 31B is not absolute.',
      Reasoning: 'The Basic Structure doctrine applies to constitutional amendments including those placing laws in Ninth Schedule. Fundamental rights forming part of basic structure cannot be violated even by Ninth Schedule laws.'
    },
    metadata: {
      court: 'Supreme Court of India',
      year: 2007,
      citation: 'AIR 2007 SC 861',
      judges: ['Y.K. Sabharwal', 'C.K. Thakker', 'P.K. Balasubramanyan', 'Ashok Bhan', 'S.B. Sinha', 'Markandey Katju', 'Dalveer Bhandari', 'P.P. Naolekar', 'H.S. Bedi'],
      category: 'Constitutional Law'
    }
  },
  {
    _id: '5',
    caseId: 'Shreya Singhal v. Union of India',
    summary: {
      Facts: 'Two young women were arrested for posting and liking a Facebook comment criticizing the shutdown of Mumbai after a political leader\'s death. This led to a challenge to Section 66A of the IT Act.',
      Issues: 'Whether Section 66A of the Information Technology Act, 2000 is constitutional. Whether it violates freedom of speech and expression under Article 19(1)(a).',
      Holding: 'The Supreme Court struck down Section 66A as unconstitutional for being vague, arbitrary and having a chilling effect on freedom of speech and expression.',
      Reasoning: 'Section 66A failed to meet the reasonable restrictions test under Article 19(2). The terms used were vague and overbroad, leading to arbitrary application. The provision had a disproportionate impact on free speech.'
    },
    metadata: {
      court: 'Supreme Court of India',
      year: 2015,
      citation: 'AIR 2015 SC 1523',
      judges: ['J. Chelameswar', 'Rohinton Fali Nariman'],
      category: 'Free Speech'
    }
  }
];

export const mockPropositions: Proposition[] = [
  {
    _id: 'p1',
    caseId: 'Kesavananda Bharati v. State of Kerala',
    proposition: 'Parliament has unlimited power to amend the Constitution including fundamental rights',
    section: 'Government\'s Argument',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p2',
    caseId: 'Kesavananda Bharati v. State of Kerala',
    proposition: 'The Constitution has a basic structure that cannot be amended or destroyed',
    section: 'Court\'s Holding',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p3',
    caseId: 'Kesavananda Bharati v. State of Kerala',
    proposition: 'Supremacy of the Constitution is part of its basic structure',
    section: 'Reasoning',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p4',
    caseId: 'Kesavananda Bharati v. State of Kerala',
    proposition: 'Separation of powers is a fundamental feature of the Constitution',
    section: 'Reasoning',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p5',
    caseId: 'Maneka Gandhi v. Union of India',
    proposition: 'Right to go abroad is part of personal liberty under Article 21',
    section: 'Court\'s Holding',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p6',
    caseId: 'Maneka Gandhi v. Union of India',
    proposition: 'Procedure established by law must be just, fair and reasonable',
    section: 'Court\'s Holding',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p7',
    caseId: 'Maneka Gandhi v. Union of India',
    proposition: 'Articles 14, 19 and 21 form a golden triangle of constitutional rights',
    section: 'Reasoning',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p8',
    caseId: 'Vishaka v. State of Rajasthan',
    proposition: 'International conventions can be enforced in absence of domestic law',
    section: 'Court\'s Holding',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p9',
    caseId: 'Vishaka v. State of Rajasthan',
    proposition: 'Gender equality includes protection from sexual harassment at workplace',
    section: 'Reasoning',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p10',
    caseId: 'Vishaka v. State of Rajasthan',
    proposition: 'Right to work with dignity is part of fundamental rights',
    section: 'Reasoning',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p11',
    caseId: 'I.R. Coelho v. State of Tamil Nadu',
    proposition: 'Laws in Ninth Schedule are completely immune from judicial review',
    section: 'Pre-existing Doctrine',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p12',
    caseId: 'I.R. Coelho v. State of Tamil Nadu',
    proposition: 'Ninth Schedule laws can be reviewed if they violate basic structure',
    section: 'Court\'s Holding',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p13',
    caseId: 'I.R. Coelho v. State of Tamil Nadu',
    proposition: 'Basic structure doctrine applies to all constitutional amendments',
    section: 'Reasoning',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p14',
    caseId: 'Shreya Singhal v. Union of India',
    proposition: 'Section 66A of IT Act is unconstitutional for being vague and arbitrary',
    section: 'Court\'s Holding',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p15',
    caseId: 'Shreya Singhal v. Union of India',
    proposition: 'Restrictions on speech must meet the reasonable restrictions test',
    section: 'Reasoning',
    embedding: Array(384).fill(0).map(() => Math.random())
  },
  {
    _id: 'p16',
    caseId: 'Shreya Singhal v. Union of India',
    proposition: 'Vague laws have a chilling effect on freedom of speech',
    section: 'Reasoning',
    embedding: Array(384).fill(0).map(() => Math.random())
  }
];

export const mockRelationships: Relationship[] = [
  // Kesavananda Bharati v. State of Kerala (p1-p4)
  {
    _id: 'r1',
    source: 'p1',
    target: 'p2',
    type: 'contradicts',
    score: 0.95
  },
  {
    _id: 'r2',
    source: 'p2',
    target: 'p3',
    type: 'supports',
    score: 0.92
  },
  {
    _id: 'r3',
    source: 'p2',
    target: 'p4',
    type: 'supports',
    score: 0.88
  },
  {
    _id: 'r17',
    source: 'p3',
    target: 'p4',
    type: 'supports',
    score: 0.85
  },
  // Maneka Gandhi v. Union of India (p5-p7)
  {
    _id: 'r4',
    source: 'p5',
    target: 'p6',
    type: 'supports',
    score: 0.90
  },
  {
    _id: 'r5',
    source: 'p6',
    target: 'p7',
    type: 'supports',
    score: 0.85
  },
  {
    _id: 'r18',
    source: 'p5',
    target: 'p7',
    type: 'supports',
    score: 0.87
  },
  // Vishaka v. State of Rajasthan (p8-p10)
  {
    _id: 'r6',
    source: 'p8',
    target: 'p9',
    type: 'supports',
    score: 0.87
  },
  {
    _id: 'r7',
    source: 'p9',
    target: 'p10',
    type: 'supports',
    score: 0.89
  },
  {
    _id: 'r19',
    source: 'p8',
    target: 'p10',
    type: 'supports',
    score: 0.83
  },
  // I.R. Coelho v. State of Tamil Nadu (p11-p13)
  {
    _id: 'r8',
    source: 'p11',
    target: 'p12',
    type: 'contradicts',
    score: 0.93
  },
  {
    _id: 'r20',
    source: 'p12',
    target: 'p13',
    type: 'supports',
    score: 0.91
  },
  {
    _id: 'r21',
    source: 'p11',
    target: 'p13',
    type: 'contradicts',
    score: 0.88
  },
  // Shreya Singhal v. Union of India (p14-p16)
  {
    _id: 'r11',
    source: 'p14',
    target: 'p15',
    type: 'supports',
    score: 0.86
  },
  {
    _id: 'r12',
    source: 'p15',
    target: 'p16',
    type: 'supports',
    score: 0.84
  },
  {
    _id: 'r22',
    source: 'p14',
    target: 'p16',
    type: 'supports',
    score: 0.82
  },
  // Cross-case relationships (these will be filtered out in single-case view)
  {
    _id: 'r9',
    source: 'p2',
    target: 'p12',
    type: 'supports',
    score: 0.91
  },
  {
    _id: 'r10',
    source: 'p2',
    target: 'p13',
    type: 'supports',
    score: 0.94
  },
  {
    _id: 'r13',
    source: 'p6',
    target: 'p15',
    type: 'supports',
    score: 0.78
  },
  {
    _id: 'r14',
    source: 'p7',
    target: 'p10',
    type: 'supports',
    score: 0.82
  }
];

/**
 * Helper function to generate graph data from propositions and relationships for a specific case
 * 
 * @param caseId - The case ID to generate graph data for
 * @returns Graph data with nodes and edges, filtered to only include propositions from the specified case
 * 
 * Note: This function filters out cross-case relationships to ensure all edges reference valid nodes
 * in the graph. Cross-case relationships exist in the data but are excluded from single-case views.
 */
export function generateMockGraphData(caseId: string) {
  const casePropositions = mockPropositions.filter(p => p.caseId === caseId);
  const propositionIds = casePropositions.map(p => p._id);
  
  const nodes = casePropositions.map(prop => ({
    id: prop._id,
    label: prop.proposition.substring(0, 50) + '...',
    proposition: prop
  }));
  
  // Only include edges where BOTH source and target are in the current case
  // This prevents "node not found" errors in the force-directed graph
  const edges = mockRelationships.filter(rel => 
    propositionIds.includes(rel.source) && propositionIds.includes(rel.target)
  ).map(rel => ({
    source: rel.source,
    target: rel.target,
    relation: rel.type
  }));
  
  return { nodes, edges };
}
