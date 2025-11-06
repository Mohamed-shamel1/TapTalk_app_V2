import mongoose from "mongoose";

// Get one document
export const findOne = async ({ model, filter = {}, select = "", populate = null } = {}) => {
    // 1. Build the query without executing it
    let query = model.findOne(filter).select(select);
    
    // 2. If populate exists, add it to the query
    if (populate) {
        query = query.populate(populate);
    }
    
    // 3. Execute the final query and return the result
    return await query;
}

// Get all documents matching a filter
export const find = async ({ model, filter = {}, select = "", populate = [] } = {}) => {
    let query = model.find(filter).select(select);
    if (populate.length > 0) {
        query = query.populate(populate);
    }
    return await query;
}

// Get document by ID
export const findById = async ({ model, id, select = "", populate = [] } = {}) => {
    let query = model.findById(id).select(select);
    if (populate.length > 0) {
        query = query.populate(populate);
    }
    return await query;
}

// Create new document(s)
export const create = async ({ model, data = {}, options = { validateBeforeSave: true } } = {}) => {
    return await model.create(data, options);
}

// Find one document and update it
export const findOneAndUpdate = async ({ model, filter = {}, data = {}, options = {} } = {}) => {
    return await model.findOneAndUpdate(filter, data, options);
}

// Update many documents
export const updateMany = async ({ model, filter = {}, data = {}, options = {} } = {}) => {
    return await model.updateMany(filter, data, options);
}

// Delete one document
export const deleteOne = async ({ model, filter = {} } = {}) => {
    return await model.deleteOne(filter);
}

export const deleteMany = async ({ model, filter = {} } = {}) => {
    return await model.deleteMany(filter);
}