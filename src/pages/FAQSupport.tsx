import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageCircle, Mail, Phone, ExternalLink } from 'lucide-react';

const FAQSupport: React.FC = () => {
  const faqs = [
    {
      question: "How do I get started as a farmer on SokoConnect?",
      answer: "Sign up with your details, complete your profile, and start exploring opportunities like bulk orders, contract farming, and the F2C marketplace. You can also list your products in city markets."
    },
    {
      question: "How does contract farming work?",
      answer: "Contract farming allows you to secure buyers before planting. Browse available contracts, apply for those matching your capabilities, and sign agreements that protect both parties with milestones, escrow payments, and dispute resolution."
    },
    {
      question: "What payment methods are supported?",
      answer: "We support M-Pesa, bank transfers, and cash on delivery for most transactions. Payment integration with M-Pesa is currently being implemented for seamless transactions."
    },
    {
      question: "How are farmers protected from exploitation?",
      answer: "SokoConnect implements multiple protection mechanisms: verified organizations, trust scores, farmer protection warnings, milestone-based payments, escrow systems, and dispute resolution processes."
    },
    {
      question: "Can I participate in carbon credit programs?",
      answer: "Yes! Visit the Carbon Forum to learn about carbon credits, connect with verified providers, and discover how to earn additional income through sustainable farming practices."
    },
    {
      question: "How does the food rescue program work?",
      answer: "Food rescue connects surplus food with those in need. Farmers and businesses can list surplus produce, and verified organizations (schools, hospitals, CBOs) can claim donations. Transport arrangements can be made through the platform."
    },
    {
      question: "What is barter trade and how does it work?",
      answer: "Barter trade allows you to exchange agricultural products without money. Create offers specifying what you're offering and what you're seeking, then connect with other traders for direct exchanges."
    },
    {
      question: "How do city market auctions work?",
      answer: "City market auctions allow you to bid on fresh agricultural products listed by verified agents. Place your bid, and if accepted, arrange for pickup at the specified market location."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions and get in touch with our support team
          </p>
        </div>

        {/* FAQ Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <Mail className="h-8 w-8 mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get help via email within 24 hours
                  </p>
                  <Button variant="outline" className="w-full">
                    support@sokoconnect.co.ke
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <Phone className="h-8 w-8 mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Phone Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Talk to our support team
                  </p>
                  <Button variant="outline" className="w-full">
                    +254 700 000 000
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Community Forum */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Community Support Forum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Join our supply chain community forum to ask questions, share experiences, and connect with other farmers and agribusiness professionals.
            </p>
            <Button asChild className="w-full sm:w-auto">
              <a 
                href="https://tenderzville-portal.co.ke/supply-chain-coded-forum/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Visit Community Forum
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="mt-8 border-amber-200 bg-amber-50 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="text-xl">Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Platform Liability:</strong> SokoConnect acts as a connecting platform between buyers and sellers. We are not liable for the quality of products, delivery issues, or disputes between parties. Always verify counterparties before transactions.
            </p>
            <p>
              <strong>Contract Farming:</strong> While we provide contract templates and dispute resolution mechanisms, users should seek legal advice before entering into contracts. SokoConnect is not responsible for contract breaches.
            </p>
            <p>
              <strong>Auctions & Barter Trade:</strong> All transactions are between users. Verify product quality and authenticity before committing to purchases or trades.
            </p>
            <p>
              <strong>Carbon Credits:</strong> Work only with verified carbon credit providers. Research providers thoroughly and understand the requirements and verification processes.
            </p>
            <p>
              <strong>Food Safety:</strong> Food rescue participants must ensure food safety standards are maintained. Check expiry dates and storage conditions before accepting donations.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FAQSupport;
