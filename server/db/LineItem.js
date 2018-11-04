const conn = require('./conn');
const LineItem = conn.define('lineItem', {
  quantity: {
    type: conn.Sequelize.INTEGER,
    validate: {
      min: 1
    },
    defaultValue: 1
  },
}, {
  hooks: {
    beforeSave: function(lineItem){
      if(!lineItem.productId){
        throw 'no productId';
      }
      return LineItem.find({
        where: {
          orderId: lineItem.orderId,
          productId: lineItem.productId,
          id: {
            $ne : lineItem.id
          }
        }
      })
      .then(lineItem=> {
        if(lineItem){
          throw 'product already exists for this order';
        }
      });
    }
  }
});

module.exports = LineItem;
