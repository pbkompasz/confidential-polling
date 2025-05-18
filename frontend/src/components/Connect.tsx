import useAccount from "@/hooks/useAccount";
import { verifyOnChain } from "@/passport";
import { ProofResult, QueryResult, ZKPassport } from "@zkpassport/sdk";
import { BrowserProvider } from "ethers";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { VERIFIER_EMAIL, VERIFIER_URL } from "@/const";
import { Link } from "react-router";
import { QRCodeCanvas } from 'qrcode.react';
import { Separator } from "./ui/separator";


const Connection = () => {
  const {
    isConnected,
    isPassportVerified,
    isEmailVerified,
    account,
    signIn,
    signUp,
    signUpHost,
    signOut,
    useDemoAccount,
  } = useAccount();

  const [showPassport, setShowPassport] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [otp, setOtp] = useState();
  const [url, setUrl] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [passportMsg, setPassportMsg] = useState('');
  const [passportProof, setPassportProof] = useState<ProofResult>();

  // TODO Might use zk-passport instead of self
  useEffect(() => {
    (async () => {
      const zkPassport = new ZKPassport();
      const queryBuilder = await zkPassport.request({
        name: 'Your App Name',
        // A path to your app's logo
        logo: 'https://your-domain.com/logo.png',
        // A description of the purpose of the request
        purpose: 'Prove you are an adult from the EU but not from Scandinavia',
        // Optional scope for the user's unique identifier
        scope: 'eu-adult-not-scandinavia',
      });

      // Build your query with the required attributes or conditions you want to verify
      const {
        url,
        requestId,
        onRequestReceived,
        onGeneratingProof,
        onProofGenerated,
        onResult,
        onReject,
        onError,
      } = queryBuilder
        // Disclose the user's firstname
        .disclose('firstname')
        // Verify the user's age is greater than or equal to 18
        .gte('age', 18)
        // Finalize the query
        .done();

      onRequestReceived(() => {
        setIsLoading(true);
        setPassportMsg('Request received');
      });
      onGeneratingProof(() => {
        setIsLoading(true);
        setPassportMsg('Generating proof');
      });
      // onProofGenerated(() => {
      //   setPassportMsg('Proof generated');
      //   setIsLoading(false);
      // });
      onResult(
        async ({
          uniqueIdentifier,
          verified,
          result,
        }: {
          uniqueIdentifier?: string;
          verified: boolean;
          result: QueryResult;
        }) => {
          if (!verified || !passportProof) {
            // If the proof is not verified, save yourself some gas and return straight away
            console.log('Proof is not verified');
            return;
          }

          // Get the verification parameters
          const verifierParams = zkPassport.getSolidityVerifierParameters({
            proof: passportProof,
            // Use the same scope as the one you specified with the request function
            scope: 'my-scope',
            // Enable dev mode if you want to use mock passports, otherwise keep it false
            devMode: false,
          });

          // Get the wallet provider
          const { browserProvider } = await useAccount();

          // Verify the proof on-chain
          // The function is defined in the next steps below
          await verifyOnChain(
            // verifierParams,
            passportProof,
            browserProvider as BrowserProvider,
            // Use the document type to determine if the proof is for an ID card or passport
            result.document_type?.disclose?.result !== 'passport',
          );

          setPassportMsg('Proof generated');
          setIsLoading(false);
        },
      );

      setUrl(url);
    })();
  }, []);

  return (
    <>
      <>
        <Dialog>
          <DialogTrigger className="text-white min-w-[220px] max-h-[50px] my-auto">
            <AnimatePresence mode="wait">
              {isConnected ? (
                <motion.div
                  key="connected"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="transition-opacity"
                >
                  {account?.name}
                  {account?.isAdmin && (
                    <Badge
                      variant="outline"
                      className="mr-auto max-h-[20px] text-red-400"
                    >
                      host
                    </Badge>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="unauthenticated"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  Authenticate
                </motion.div>
              )}
            </AnimatePresence>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isConnected ? 'Account details' : 'Authenticate'}
              </DialogTitle>
              <DialogDescription className="min-h-[50px]">
                <AnimatePresence mode="wait">
                  {isConnected ? (
                    <motion.div
                      key="connected-content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden space-y-4 p-2"
                    >
                      <div className="flex flex-row gap-2">
                        <p className="text-lg">{account?.name}</p>
                        {isPassportVerified && (
                          <Badge variant="outline" className="max-h-[40px]">
                            <img
                              src="https://pbs.twimg.com/profile_images/1819859281639829504/HsRc4VVq_400x400.jpg"
                              alt="passport"
                              width={20}
                              height={20}
                            />
                          </Badge>
                        )}

                        {isEmailVerified && (
                          <Badge variant="outline" className="max-h-[40px]">
                            <img
                              src="https://avatars.githubusercontent.com/u/109933158?s=200&v=4"
                              alt="email"
                              width={20}
                              height={20}
                            />
                          </Badge>
                        )}
                      </div>
                      <p>Forms submitted: 0</p>
                      <div className="flex gap-2 max-w-full">
                        {!isPassportVerified && (
                          <Button
                            onClick={() => {
                              setShowEmail(false);
                              setShowPassport(true);
                            }}
                          >
                            Link your passport
                          </Button>
                        )}
                        {!isEmailVerified && (
                          <Button
                            onClick={async () => {
                              setShowPassport(false);
                              setShowEmail(true);
                              if (otp) return;
                              let resp = await fetch(
                                `${VERIFIER_URL}/email-verification`,
                              );
                              resp = await resp.json();
                              console.log((resp as any).otp);
                              setOtp((resp as any).otp);
                            }}
                          >
                            Link your email address
                          </Button>
                        )}
                        <Button onClick={signOut}>Sign out</Button>
                      </div>
                      {showPassport && (
                        <div className="flex flex-col items-center text-lg">
                          <Link
                            to={
                              'https://play.google.com/store/apps/details?id=app.zkpassport.zkpassport'
                            }
                            target="_blank"
                          >
                            1. Download ZKPassport
                          </Link>
                          <p>2. Link your passport in the app</p>
                          <p>3. Scan the QR code below</p>
                          <QRCodeCanvas value={url} />,
                        </div>
                      )}
                      {showEmail && (
                        <>
                          {otp ? (
                            <div className="flex flex-col items-center">
                              <p>Click the button below</p>
                              <Button>
                                <a
                                  href={`mailto:${VERIFIER_EMAIL}?subject=Account verification&body=OTP: ${otp}`}
                                >
                                  Send email
                                </a>
                              </Button>
                              <p>OR</p>
                              <p>
                                Manually send an email to {VERIFIER_EMAIL} w/
                                subject "Account verification" and body "OTP:{' '}
                                {otp}"
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-lg text-center text-red-400">
                                Error: Verification service down
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unauthenticated-content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden space-y-4 flex flex-col"
                    >
                      <div>
                        <p className="text-lg text-center">Sign up</p>
                        <div className="flex justify-evenly mt-2">
                          <Button onClick={signUp} className="w-[150px]">
                            Sign up
                          </Button>
                          <Button onClick={signUpHost} className="w-[150px]">
                            Sign up as a host
                          </Button>
                        </div>
                      </div>
                      <Separator />
                      <p className="text-lg text-center">Sign up</p>
                      <Button onClick={signIn} className="w-[200px] mx-auto">
                        Sign in
                      </Button>
                      <Separator />
                      <p className="text-lg text-center">Use a demo account</p>
                      <div className="flex justify-evenly">
                        <Button onClick={() => useDemoAccount(0)}>
                          Alice (host)
                        </Button>
                        <Button onClick={() => useDemoAccount(1)}>
                          Bob (respondent)
                        </Button>
                        <Button onClick={() => useDemoAccount(2)}>
                          Carol (analyst)
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    </>
  );
};

export default Connection;