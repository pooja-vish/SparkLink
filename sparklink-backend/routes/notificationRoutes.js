const express = require('express');
const router = express.Router();
const {
    fetchNotifications, fetchNotificationCount, NotificationOkay
  } = require('../controllers/notificationController');  // Adjust path as needed

router.get('/', fetchNotifications);
router.get('/count',fetchNotificationCount);
router.post('/okay',NotificationOkay);

module.exports = router;
