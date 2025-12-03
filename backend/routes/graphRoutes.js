import express from 'express';
import Proposition from '../models/Proposition.js';
import Relationship from '../models/Relationship.js';

const router = express.Router();

router.get('/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;

    // 1️⃣ Fetch all propositions in that case
    const propositions = await Proposition.find({ caseId });
    if (!propositions.length)
      return res.status(404).json({ message: 'No propositions found for this case' });

    const propIds = propositions.map(p => p._id.toString());

    // 2️⃣ Fetch relationships between propositions in the same case
    const relationships = await Relationship.find({
      source: { $in: propIds },
      target: { $in: propIds }
    });

    // 3️⃣ Format nodes
    const nodes = propositions.map(p => ({
      id: p._id.toString(),
      label: p.proposition?.slice(0, 80) + '...',
      type: 'Proposition'
    }));

    // 4️⃣ Format edges from the Relationship collection
    const edges = relationships.map(r => ({
      id: r._id.toString(),
      source: r.source.toString(),
      target: r.target.toString(),
      relation: r.type,
      weight: r.similarity
    }));

    res.status(200).json({ nodes, edges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
