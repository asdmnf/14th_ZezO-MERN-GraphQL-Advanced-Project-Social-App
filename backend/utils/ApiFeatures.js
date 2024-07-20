const CustomGQLError = require("../graphql/errors/CustomGQLError");

class ApiFeatures {
  constructor(query, args) {
    this.query = query;
    this.args = args;
  }
  // pagination
  paginate(allResults, allDocuments) {
    // default values
    const page = this.args.page * 1 || 1
    const limit = this.args.limit * 1 || 10
    const skip = (page - 1) * limit
    
    const paginationObject = {}
    // limit
    paginationObject.limit = limit * 1 
    // previous page
    if (skip > 0) { 
      paginationObject.previousPage = page - 1 
    }
    // current page
    paginationObject.currentPage = page
    // next page
    if ( page * limit < allResults) { 
      paginationObject.nextPage = page + 1
    }
    // total pages
    paginationObject.totalPages = Math.ceil(allResults / limit) || 1
    // result total documents
    paginationObject.resultTotalDocuments = allResults
    // overall documents
    paginationObject.overallDocuments = allDocuments
    // pagination object
    this.paginationObject = paginationObject

    // query
    this.query = this.query.skip(skip).limit(limit)
    // chain query
    return this
  }
  // sorting
  sort() {
    if (this.args.sort) {
      const sort = this.args.sort || "-createdAt"
      // query
      this.query = this.query.sort(sort)
    }
    // chain query
    return this
  };
  // searching
  search() {
    if (this.args.search) {
      // build search query
      const fieldAndKeywordQuery = this.args.search.map((search) => {
        return {
          [search.field]: { $regex: search.keyword, $options: "i" } 
        }
      })
      // apply search query
      const searchQuery = {
        $or: fieldAndKeywordQuery
      }
      // query
      this.query = this.query.find(searchQuery)
    }
    // chain query
    return this
  };
  // first and last
  firstAndLast(allDocuments) {
    if (this.args.first) {
      // first query
      this.query = this.query.limit(this.args.first)
    }
    if (this.args.last) {
      // last query
      this.query = this.query.skip(Math.max(0, allDocuments - this.args.last))
    }
    // chain query
    return this
  };
  // filterting
  filter() {
    if (this.args.filter) {
      // allowed operators
      const allowedOperators = ["$eq", "$ne", "$gt", "$gte", "$lt", "$lte"];
      let filterObject = {}
      // build filter object
      this.args.filter.forEach(filter => {
        if (filter.value.startsWith('$')) {
  
  // if the operator is not in the allowed operators then throw an error
  if (!allowedOperators.includes(filter.value.split(' ')[0])) {
    throw new CustomGQLError(`Invalid filter operator: ${filter.value.split(' ')[0]}, allowed operators: ${allowedOperators.join(', ')}, example: {field: "price", value: "$gte 50"}`, 'BAD_USER_INPUT')
  }
          // if value starts with $
          const splittedValueArray = filter.value.split(' ')
          const finalValueObject = {[splittedValueArray[0]]: splittedValueArray[1]}
        // final object if value starts with $
        filterObject[filter.field] = { ...filterObject[filter.field], ...finalValueObject }
        } else {
          // final object with direct value
          filterObject[filter.field] = filter.value
        }
      })
      // query
      this.query = this.query.find(filterObject)
    }
    // chain query
    return this
  };
}

module.exports = ApiFeatures