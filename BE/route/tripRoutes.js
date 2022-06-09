const express = require("express");
const tripController = require("../controllers/tripController");
const { jwtAuth } = require("../middleware/jwtAuth");
const { authorize } = require("../middleware/authorize");
const router = express.Router();

router.post("/", jwtAuth, tripController.getTrip);
router.get("/getAllTrip", jwtAuth, tripController.getAllTrip);
router.get("/getSource", jwtAuth, tripController.getSource);
router.get("/getDestination", jwtAuth, tripController.getDestination);
router.get(
  "/getTripById/:id",
  jwtAuth,
  authorize("admin"),
  tripController.getTripById
);
router.post("/getSeat", jwtAuth, tripController.getSeat);
router.post(
  "/createTrip",
  jwtAuth,
  authorize("admin"),
  tripController.createTrip
);
router.delete("/:id", jwtAuth, authorize("admin"), tripController.deleteTrip);
router.patch("/:id", jwtAuth, authorize("admin"), tripController.updateTrip);
module.exports = router;
