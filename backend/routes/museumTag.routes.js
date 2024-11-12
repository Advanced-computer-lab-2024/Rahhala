import express from 'express';
import {
    createMuseumTag,
    getMuseumTags,
    getMuseumTagById,
    updateMuseumTag,
    deleteMuseumTag
} from '../controllers/museumTag.controller.js';

const router = express.Router();

router.post('/', createMuseumTag);
router.get('/', getMuseumTags);
router.get('/:id', getMuseumTagById);
router.put('/:id', updateMuseumTag);
router.delete('/:id', deleteMuseumTag);

export default router;