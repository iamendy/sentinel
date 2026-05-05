import Mesh from "@/components/Mesh";
import Code from "@/components/Code";
import { Advance, Secure, Intrusion } from "@/components/icons";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="px-4 py-4 lg:py-20 lg:px-10 flex flex-col lg:flex-row lg:gap-x-16 lg:items-center lg:space-y-0 xl:px-0 xl:max-w-[1400px] xl:py-28 mx-auto">
        <div className="lg:flex-1">
          <h1 className="font-manrope font-medium text-[35px] mb-2 lg:text-[55px] lg:leading-[120%] xl:w-[60%]">
            AI-powered fraud prevention{" "}
            <span className="text-red">for Africa</span>
          </h1>

          <p className="font-slackey text-features text-lg leading-[1.5em] w-[80%] xl:w-[70%]">
            Detect and prevent fraud before transactions occur – powered by
            Nokia Network as Code and AI-driven risk decisions.
          </p>

          <div className="my-9 lg:mb-11">
            <Link
              href="/demo"
              className="bg-white text-sm rounded-lg leading-none px-4 py-3 lg:px-6 lg:py-3 lg:text-lg  text-gray-400 hover:bg-red hover:text-white transition-colors"
            >
              Try a demo
            </Link>
          </div>
        </div>

        <div className=" lg:w-[500px] lg:h-[500px]">
          <img
            src="/img/security.svg"
            alt="security alert"
            className="w-full"
          />
        </div>
      </section>

      <section className="overflow-hidden xl:px-0 xl:max-w-[1400px] mx-auto">
        <Mesh />
      </section>

      <section className="py-16 px-4 lg:py-20 lg:px-10 xl:px-0 xl:max-w-[1400px] mx-auto">
        <div className="space-y-8 lg:space-y-0 lg:flex lg:gap-x-8 items-center">
          <div className="feature relative flex space-x-4 border-b pb-8 border-b-features/40 lg:pb-0 lg:border-b-0 items-start">
            <Advance />
            <div className="flex-col space-y-2 ">
              <h3 className="font-manrope text-lg">SIM swap detection</h3>
              <p className="text-features">
                Detect SIM swaps in real-time – stop fraudsters from
                intercepting OTPs and draining accounts.
              </p>
            </div>
          </div>

          <div className="feature relative flex space-x-4 border-b pb-8 border-b-features/40 lg:pb-0 lg:border-b-0 lg:pr-5">
            <Secure />

            <div className="flex-col space-y-2 ">
              <h3 className="font-manrope text-lg">
                KYC & identity verification
              </h3>
              <p className="text-features">
                Passwordless KYC for SME onboarding. Verify any phone number
                against official records.
              </p>
            </div>
          </div>

          <div className="flex space-x-4 ">
            <Intrusion />

            <div className="flex-col space-y-2 ">
              <h3 className="font-manrope text-lg">Device & location trust</h3>
              <p className="text-features lg:pr-5">
                Assess device compromise and verify location before approving
                high-risk transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 lg:py-20 lg:px-10 xl:px-0 xl:max-w-[1400px] mx-auto">
        <div className="lg:flex lg:items-center">
          <div className="lg:flex-1">
            <h3 className=" text-red text-[16px] mb-6">
              AI-powered risk decisions
            </h3>

            <h1 className="font-manrope font-medium text-[28px] leading-[130%] mb-4 pr-4 lg:text-[44px] lg:w-[80%]">
              From network signals to plain English recommendations
            </h1>
            <p className="text-features leading-[1.5em] text-lg lg:w-[85%] pr-3">
              From recipient safety checks to bulk verification and device trust
              scoring – Sentinel gives fintechs, banks, and mobile money
              operators a unified API for fraud prevention.
            </p>
          </div>

          <div className="mt-8 lg:flex-1">
            <img src="/img/threat.svg" alt="" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 lg:py-20 lg:px-10 xl:px-0 xl:max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h3 className="font-manrope font-medium mb-6 text-[28px] leading-[120%] lg:text-[44px] lg:leading-[120%]">
            Why Sentinel?
          </h3>
          <p className="font-inter text-features text-[18px] leading-[1.5em] pr-3 lg:w-[40%]">
            African fintechs, banks, and SMEs have no unified way to verify
            transaction safety or detect fraud before it happens. Until now.
          </p>
        </div>

        <div className="space-y-8  lg:space-y-0 lg:flex lg:gap-x-8">
          <div className="card relative overflow-hidden px-8 pt-8 rounded-lg">
            <h4 className="font-manrope text-[20px] font-medium text-white mb-4">
              Nokia NaC APIs integrated
            </h4>
            <p className="text-[16px] leading-[1.8em] mb-4">
              SIM Swap, KYC Match, Device Status, Device Swap, Location
              Verification, and Location Retrieval – working together to stop
              fraud before it happens.
            </p>

            <Code />
          </div>
          <div className="flex flex-col space-y-8">
            <div className="card overflow-hidden px-8 py-8 rounded-lg">
              <h4 className="font-manrope text-[20px] font-medium text-white mb-4">
                Built for African businesses
              </h4>
              <p className="text-[16px] leading-[1.8em]">
                Mobile money users, fintechs, banks, SMEs, ride-hailing
                platforms, and mobile money operators – Sentinel protects them
                all.
              </p>
            </div>
            <div className="card overflow-hidden px-8 py-8 rounded-lg">
              <h4 className="font-manrope text-[20px] font-medium text-white mb-4 pr-3">
                85-95% of SIM swap attacks prevented
              </h4>
              <p className="text-[16px] leading-[1.8em] mb-5">
                That's over $3.7B in annual global fraud reduction potential.
                Every transaction gets a risk score in milliseconds.
              </p>
              <div className="border border-white/10 w-fit bg-white/[0.05] rounded-[100px] py-3 px-4 text-sm flex items-center space-x-3">
                <div className="bg-green-200 rounded-full h-[6px] w-[6px] animate-ping flex"></div>
                <span className="text-white"> Active Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
