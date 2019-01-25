'use strict';

function checkBodyIsValid(req, res) {
  if (req.body == null || req.body.value == null ||
      typeof req.body.value !== 'string' ||
      req.body.value.trim() === '') {
    res.sendStatus(400);
    return false;
  }

  return true;
}

module.exports = {
  checkBodyIsValid,
};
