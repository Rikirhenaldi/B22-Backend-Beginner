const variantsModel = require('../models/variants')

const timeHelper = require('../helpers/date')
const { response } = require('../helpers/standardResponse')

exports.createVariants = async (req, res) => {
  if (req.body.variant === undefined) {
    return response(res, 400, false, 'request errors')
  } else {
    if (req.body.variant.length < 3) {
      return response(res, 400, false, 'name of variant must be specifict')
    } else {
      const results = await variantsModel.createVariant(req.body)
      if (results.affectedRows) {
        return response(res, 200, true, 'Variant Created Succsessfully')
      } else {
        return response(res, 400, false, 'Variant Created Failed')
      }
    }
  }
}

exports.getVariants = async (req, res) => {
  const cond = req.query.search || ''
  const results = await variantsModel.getVariant(cond)
  if (req.query.search === '') {
    return response(res, 200, true, 'list of all variant', results)
  } else {
    if (results.length > 0) {
      return response(res, 200, true, `list of variant from ${cond}`, results)
    } else {
      return response(res, 400, false, 'variant not found')
    }
  }
}

exports.updateVariant = async (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  const results = await variantsModel.getVariantById(id)
  if (results.length > 0) {
    const { variant } = req.body
    const updateData = { id, variant, updated_at: timeHelper.date() }
    const updateResults = await variantsModel.updateVariant(updateData)
    try {
      return res.status(200).json({
        success: true,
        message: 'Variant updated succsessfuly'
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

exports.deleteVariant = async (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  const results = await variantsModel.getVariantById(id)
  if (results.length > 0) {
    const deleteItem = await variantsModel.deleteVariant(id)
    try {
      return res.status(200).json({
        success: true,
        message: 'Variant has been Deleted'
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
      message: 'variant not found'
    })
  }
}
