import Review from "../models/review.model.js";

// Add Review to the Database
export const addReview = async (req, res) => {
    console.log("entered addReview");

    const touristId = req.user.id;
    const { rating, title, body, reviewedEntity, reviewedEntityType } = req.body;
    try {
        if (!rating) return res.status(400).json({ message: "Missing rating" });
        if (!reviewedEntity) return res.status(400).json({ message: "Missing reviewed entity" });
        if (!reviewedEntityType) return res.status(400).json({ message: "Missing reviewed entity type" });

        const review = await Review.create({
            tourist: touristId,
            rating,
            title,
            body,
            reviewedEntity,
            reviewedEntityType,
        });
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get Reviews from the Database
export const getReviews = async (req, res) => {
    console.log("entered getReviews");

    try {
        const reviews = await Review.find();
        if (reviews.length === 0)
            return res.status(200).json({ message: "No current reviews" });
        return res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get Reviews by Tourist ID
export const getReviewsByTouristID = async (req, res) => {
    console.log("entered getReviewsByTouristID");

    const id = req.user.id;
    if (!id) return res.status(400).json({ message: "Missing ID" });
    try {
        const query = { tourist: id };
        const reviews = await Review.find(query);
        if (!reviews)
            return res.status(404).json({ message: "Reviews not found" });
        return res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Edit Review Information
export const editReview = async (req, res) => {
    console.log("entered editReview");

    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Missing ID" });
    const { rating, title, body } = req.body;
    try {
        const review = await Review.findById(id);
        if (!review)
            return res.status(404).json({ message: "Review not found" });

        review.rating = rating || review.rating;
        review.title = title || review.title;
        review.body = body || review.body;
        await review.save();

        return res.status(200).json(review);
    } catch (error) {
        console.error("Error fetching review:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Review from Database
export const deleteReview = async (req, res) => {
    console.log("entered deleteReview");

    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Missing ID" });

    try {
        const review = await Review.findByIdAndDelete(id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        return res
            .status(200)
            .json({ message: "Review deleted successfully", review });
    } catch (error) {
        console.error("Error deleting review:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get Review by ID
export const getReviewById = async (req, res) => {
    console.log("entered getReviewById");

    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Missing ID" });

    try {
        const review = await Review.findById(id);
        if (!review)
            return res.status(404).json({ message: "Review not found" });
        return res.status(200).json(review);
    } catch (error) {
        console.error("Error fetching review:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get Reviews by Entity Type and Entity ID
export const getReviewsByEntity = async (req, res) => {
    console.log("entered getReviewsByEntity");

    const { entityType, entityId } = req.params;
    if (!entityType) return res.status(400).json({ message: "Missing entity type" });
    if (!entityId) return res.status(400).json({ message: "Missing entity ID" });

    try {
        const query = { reviewedEntityType: entityType, reviewedEntity: entityId };
        const reviews = await Review.find(query);
        if (reviews.length === 0)
            return res.status(404).json({ message: "No reviews found for this entity" });
        return res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};