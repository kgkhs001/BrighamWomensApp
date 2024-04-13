import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
const router: Router = express.Router();
import { medicalDeviceDelivery } from "common/src/medicalDeviceDelivery.ts";
//Creates record in the general db and the specific db for medical device service requests
router.post("/", async function (req: Request, res: Response) {
  const input: medicalDeviceDelivery = req.body;
  try {
    const roomStuff = await PrismaClient.nodes.findMany({
      where: {
        long_name: input.roomName,
      },
    });
    await PrismaClient.generalService.create({
      data: {
        type: "Medical Device Delivery",
        location: roomStuff[0].node_id,
        status: input.status,
        emp_name: input.employeeName,
        priority: input.priority,
      },
    });

    const id = await PrismaClient.generalService.findMany({
      where: {
        type: "Medical Device Delivery",
        location: roomStuff[0].node_id,
        status: input.status,
        emp_name: input.employeeName,
        priority: input.priority,
      },
    });
    if (input.deliveryDate != undefined) {
      await PrismaClient.medicalDevice.create({
        data: {
          id: id[0].id,
          device: input.medicalDeviceName,
          quantity: Number(input.quantity),
          date: input.deliveryDate?.toString(),
          room_name: input.roomName,
        },
      });
    }
  } catch (e) {
    //Console log error if the data can't be stored
    console.log(e);
    res.sendStatus(400);
    return;
  }
  //Console log "Ok" if the database successfully collects the data
  res.sendStatus(200);
});

router.get("/", async function (req: Request, res: Response) {
  try {
    const data = await PrismaClient.medicalDevice.findMany();
    res.send(data);
  } catch (e) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

export default router;
