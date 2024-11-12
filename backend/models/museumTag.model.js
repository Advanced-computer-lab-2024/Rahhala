import mongoose from 'mongoose';

const museumTagSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Monuments', 'Museums', 'Religious Sites', 'Palaces/Castles'],
        required: true
    },
    historicalPeriod: {
        type: String,
        required: true
    }
});

const MuseumTag = mongoose.model('MuseumTag', museumTagSchema);

export default MuseumTag;