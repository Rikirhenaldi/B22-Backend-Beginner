const categoriesModel = require('../models/categories')

const timeHelper = require('../helpers/date')
const { response } = require('../helpers/standardResponse')

exports.createCategories = async (req, res) => {
  if (req.body.category === undefined) {
    return response(res, 500, false, 'request body erorrs')
  } else {
    if (req.body.category.length < 3) {
      return response(res, 400, false, 'name of category must be specifict')
    } else {
      const results = await categoriesModel.createCategory(req.body)
      if (results.affectedRows) {
        return response(res, 200, true, 'Category Created Succsessfully')
      } else {
        return response(res, 400, false, 'Category Created Failed')
      }
    }
  }
}

exports.getCategories = async (req, res) => {
  const results = await categoriesModel.getCategory()
  if (results.length > 1) {
    return response(res, 200, true, 'List of Category', results)
  } else {
    return response(res, 400, false, 'ann errors occurred')
  }
}

exports.updateCategory = async (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  const results = await categoriesModel.getCategoryById(id)
  if (results.length > 0) {
    const { category } = req.body
    const updateData = { id, category, updated_at: timeHelper.date() }
    const updateResults = await categoriesModel.updateCategory(updateData)
    try {
      return res.status(200).json({
        success: true,
        message: 'Category updated succsessfuly'
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: 'an error occurred'
      })
    }
  } else {
    return res.status(404).json({
      success: false,
      message: 'Cant update item cause item not found'
    })
  }
}

exports.deleteCategory = async (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  const results = await categoriesModel.getCategoryById(id)
  if (results.length > 0) {
    const deleteItem = await categoriesModel.deleteCategory(id)
    try {
      return res.status(200).json({
        success: true,
        message: 'Category has been Deleted'
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'ann errors occurred'
      })
    }
  } else {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    })
  }
}
