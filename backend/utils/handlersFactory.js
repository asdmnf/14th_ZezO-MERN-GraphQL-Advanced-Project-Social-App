const ApiFeatures = require("./ApiFeatures");
const updateSingleFile = require("./fileUploads/updateSingleFile");

exports.getAllDocuments = async (model, args, context, findFilter) => {
  // overall documents
  const allDocuments = await model.countDocuments(findFilter);
  // apply all api features
  const apiFeatures = new ApiFeatures(model.find(findFilter), args)
    .sort()
    .search()
    .firstAndLast(allDocuments)
    // ApiFeatures
    .filter();

    // result total documents
  const allResults = await model.countDocuments(apiFeatures.query);
  // apply pagination
  apiFeatures.paginate(allResults, allDocuments).firstAndLast(allDocuments);

  // full query
  const documents = await apiFeatures.query;

  // return data with pagination
  return {
    data: documents,
    pagination: apiFeatures.paginationObject,
  };
};

exports.getOneDocument = async (model, args, context) => {
  const document = await model.findById(args.id);
  return document;
}

exports.updateOneDocument = async (model, args, context, filePrefix, fileFolder) => {

  // change image
  if(args.file) {
    args = await updateSingleFile(model, args, context, filePrefix, fileFolder)
  }

  // update document
  const updatedDocument = await model.findByIdAndUpdate(
    args.id,
    args,
    { new: true }
  )
  return updatedDocument
}

exports.deleteOneDocument = async (model, args, context) => {
  // delete document
  const deletedDocument = await model.findByIdAndDelete(args.id)
  return deletedDocument
}
