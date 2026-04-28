import connect from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { phoneNumber } = await request.json();

    // Validate phoneNumber
    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone number is required",
        },
        { status: 400 },
      );
    }

    //sim swap
    const { data: simSwap } = await connect.post(
      "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/sim-swap/sim-swap/v0/check",
      {
        phoneNumber,
        maxAge: 240,
      },
    );

    console.log(simSwap);

    //device status
    const { data: deviceStatus } = await connect.post(
      "https://network-as-code.p-eu.rapidapi.com/device-status/v0/connectivity",
      {
        device: {
          phoneNumber,
        },
      },
    );

    console.log(deviceStatus);

    // location retrieval
    const { data: locationRetrieval } = await connect.post(
      "https://network-as-code.p-eu.rapidapi.com/location-retrieval/v0/retrieve",
      {
        device: {
          phoneNumber,
        },
        maxAge: 60,
      },
    );

    console.log(locationRetrieval);

    //location verification
    const { data: locationVerification } = await connect.post(
      "https://network-as-code.p-eu.rapidapi.com/location-verification/v1/verify",
      {
        device: {
          phoneNumber: "+99999991000",
        },
        area: {
          areaType: "CIRCLE",
          center: {
            latitude: 50.735851,
            longitude: 7.10066,
          },
          radius: 50000,
        },
      },
    );

    console.log(locationVerification);

    //device swap
    const { data: deviceSwap } = await connect.post(
      "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/device-swap/device-swap/v1/check",
      {
        phoneNumber: "+99999991000",
        maxAge: 120,
      },
    );

    console.log(deviceSwap);

    //number verification
    const { data: numberVerification } = await connect.post(
      "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/number-verification/number-verification/v0/verify",
      {
        phoneNumber,
      },
    );

    console.log(numberVerification);

    // Send successful response
    return NextResponse.json(
      {
        success: true,
        data: phoneNumber,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error occurred: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
