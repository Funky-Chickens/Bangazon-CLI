'use strict';

let activeCustomer = {
  id: null
}

let setActiveCustomer = (id) => {
  activeCustomer.id = id;
}

let getActiveCustomer = () => activeCustomer;


module.exports={setActiveCustomer, getActiveCustomer};