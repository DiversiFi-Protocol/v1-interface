import SingleColumnLayout from '@/layouts/SingleColumnLayout';

import { cn } from '@/lib/tw';

export default function TermsPage() {
  return (
    <SingleColumnLayout className="p-4">
      <div className={legalStyles}>
        <h1>Terms and Conditions</h1>
        <h1>DiversiFi</h1>
        <h3>Last updated: 09/06/2025</h3>

        <p>
          These Terms and Conditions (“Terms”) govern your access to and use of the DiversiFi
          protocol at <a href="https://diversifi.tech/">https://diversifi.tech/</a> (“DiversiFi”)
          and all associated applications, services, APIs, software, content, features, and
          functionality including any updates, upgrades, modified versions, extensions,
          improvements, and derivative works of the foregoing (collectively, the “Services”). These
          Terms constitute a legally binding agreement between you and DiversiFi (“we,” “us,” or
          “our”). By accessing or using the Services, you agree to be bound by these Terms. IF YOU
          DO NOT AGREE TO THESE TERMS, DO NOT ACCESS OR USE THE SERVICES.
        </p>

        <h3>
          1. <Underline>Eligibility</Underline>
        </h3>
        <p>
          1.1. You may use the Services only (i) for lawful purposes; and (ii) in accordance with
          these Terms. You shall not use or access the Services in violation of these Terms.
        </p>

        <p>
          1.2. In order to use the Services, you hereby represent, warrant, and covenant that you
          have the legal capacity (including, without limitation, being of sufficient age) to enter
          into contracts under the law of the jurisdiction in which you reside and are an Eligible
          User. An “Eligible User” is a user that meets ALL the following criteria:
          <ul>
            <li>
              if a natural person, at least 18 years old or of legal age to form a binding contract
              under applicable law;
            </li>
            <li>not physically in any Prohibited Jurisdiction;</li>
            <li>not a resident of any Prohibited Jurisdiction;</li>
            <li>
              not a legal person or legal entity incorporated, registered or organized under the
              laws of any Prohibited Jurisdiction;
            </li>
            <li>not a politically exposed person; and</li>
            <li>
              not on any trade or economic sanctions lists, including, but not limited to, the UN
              Security Council Sanctions list, designated as a “Specially Designated National” by
              OFAC (Office of Foreign Assets Control of the U.S. Treasury Department) or placed on
              the U.S. Commerce Department’s “Denied Persons List”, or any other trade or economic
              sanctions list of the United States of America, Canada, the United Kingdom of Great
              Britain and Northern Ireland, the European Union, the Republic of Singapore or the
              Swiss Confederation.
            </li>
          </ul>
        </p>

        <p>
          “Prohibited Jurisdiction” means (i) any state, country or other jurisdiction that is
          sanctioned and/or embargoed by the United States of America, the United Nations, the
          United Kingdom, the European Union and/or Switzerland; (ii) a jurisdiction where it would
          be illegal according to local law or regulation for you to user the Services; (iii) any
          disputed or self-proclaimed territories that are subject to international sanctions; or
          (iv) where the use of the Services could subject DiversiFi to any local registration,
          regulatory or licensing requirements.
        </p>

        <p>
          1.3. We grant you a revocable, limited, royalty-free, non-exclusive, non-transferable, and
          non-sublicensable license to access and use the Services through your internet compatible
          devices for your personal/internal purposes subject to these Terms, to access and use the
          Services solely for approved purposes as permitted by DiversiFi. DiversiFi reserves the
          right to terminate or suspend this license at any time, with or without cause and with or
          without notice. You hereby agree that when you use the Services, DiversiFi does not
          transfer the Services or any intellectual property rights to you.
        </p>

        <h3>
          2. <Underline>RISKS OF USING THE SERVICES</Underline>
        </h3>

        <p>
          2.1. Using the Services involves inherent risks. Before engaging with the Services, you
          should thoroughly research and understand these risks. Risks may arise across the
          following protocol functions:
        </p>

        <p>
          - Minting, redeeming, or swapping the DiversiFi index token (DFiUSD) (the “Index Token”)
        </p>

        <p>
          - Providing liquidity, minting or redeeming DFiUSD, or participating in rebalancing
          operations
        </p>

        <p>- Engaging with governance, reallocation mechanisms, or DAO-directed incentives</p>

        <p>
          - Holding the index token, especially in the event of a depeg or a deviation of an
          underlying asset
        </p>

        <p>
          2.2. You acknowledge and agree that you should not use the Services with funds you cannot
          afford to lose. While stablecoin-backed portfolios like DiversiFi’s aim to reduce depeg
          risk by diversifying across multiple assets, they do not eliminate risk entirely, and you
          may lose all funds invested.
        </p>

        <p>
          2.3. As a decentralized protocol, all transactions are final and irreversible once
          submitted to the blockchain. The DiversiFi team cannot and will not reverse, cancel, or
          modify any on-chain activity under any circumstances. Users acknowledge and accept full
          responsibility for all transactions they initiate.
        </p>

        <h3>
          3. <Underline>RISKS OF USING THE SERVICES</Underline>
        </h3>

        <p>
          3.1. DiversiFi’s smart contracts may be subject to internal and third-party audits.
          However, the potential presence of audits does not eliminate all smart contract or
          blockchain-based risks. Users should understand that bugs, vulnerabilities, or exploits
          may occur and may result in partial or total loss of funds.
        </p>

        <h3>
          4. <Underline>STABLECOIN PEG RISK AND REBASE EVENTS</Underline>
        </h3>

        <p>
          4.1. DiversiFi relies on a diversified basket of pegged assets (e.g., stablecoins). If one
          or more of these assets loses its peg, the protocol may initiate a rebalancing or rebasing
          event that adjusts Index Token balances to reflect the real market value of the impaired
          asset(s). In such a scenario, holders of the Index Token may experience a reduction in
          token balance or value. DiversiFi does not guarantee capital preservation or peg
          maintenance of any underlying asset.
        </p>

        <h5>
          5. <Underline>ACCEPTANCE OF TERMS</Underline>
        </h5>

        <p>
          - You understand the risks associated with cryptocurrency, DeFi, and tokenized asset
          protocols.
        </p>

        <p>
          - You are solely responsible for your interactions with the Services and assume full
          liability for any loss incurred through their use.
        </p>

        <p>
          - You acknowledge that DiversiFi is a non-custodial, decentralized protocol and that the
          DiversiFi team does not control user assets or wallets.
        </p>

        <p>
          - The DiversiFi team cannot guarantee that any transaction will be confirmed on a
          blockchain or processed as expected. Transactions may be delayed, dropped, or reordered by
          the network.
        </p>

        <p>
          - The DiversiFi team is not licensed by any federal, state, or regulatory authority. Users
          acknowledge that the Services are not subject to the same regulatory oversight as
          traditional financial services. However, DiversiFi reserves the right to implement any
          compliance measures, including but not limited to KYC/AML procedures, as may be required
          by applicable laws or regulations.
        </p>

        <p>
          - You are responsible for understanding and complying with any applicable tax obligations
          related to your use of the Services.
        </p>

        <p>
          5.2. The Services may, now or in the future, rely on third-party APIs, oracles, or
          integrations. By using the Services, you acknowledge that you may be subject to additional
          terms or costs imposed by such third parties, and DiversiFi makes no guarantees regarding
          their availability or accuracy.
        </p>

        <h3>
          6. <Underline>PROHIBITED USES</Underline>
        </h3>

        <p>
          6.1. You agree that you will not use the DiversiFi protocol or Services in a way that:
        </p>

        <p>
          - Violates any law, regulation, or third-party rights (including intellectual property
          rights);
        </p>

        <p>- Engages in harmful, deceptive, harassing, or fraudulent behavior;</p>

        <p>- Attempts to gain unauthorized access to other users’ wallets, data, or accounts;</p>

        <p>
          - Seeks to interfere with the security, integrity, or proper functioning of the protocol.
        </p>

        <p>
          6.2. Users shall not exploit vulnerabilities in the smart contracts or manipulate economic
          mechanisms of the DiversiFi protocol. Any attempt to engage in such activities is strictly
          prohibited. In the event that such actions occur, DiversiFi reserves the right to restrict
          access to its front-end interfaces and pursue any and all remedies available under
          applicable law.
        </p>

        <h3>
          7. <Underline>SECURITY AND WALLET RESPONSIBILITY</Underline>
        </h3>

        <p>
          7.1. You are solely responsible for maintaining the security and confidentiality of your
          wallet(s), private keys, and recovery phrases. The DiversiFi team does not and cannot
          access your wallet or keys. If you lose access to your wallet, we cannot recover your
          funds.
        </p>

        <p>
          7.2. Never share your private key or seed phrase. No one from DiversiFi will ever request
          this information.
        </p>

        <h3>
          8. <Underline>PRIVACY POLICY AND DATA COLLECTION</Underline>
        </h3>

        <p>
          8.1. DiversiFi is designed to collect as little personal data as possible. However, the
          following data may be collected automatically when interacting with the Services:
        </p>

        <p>
          - Device and browser information, IP address, cookie identifiers, usage and session data,
          and traffic source
        </p>

        <p>
          - Any additional information you voluntarily provide during communications (e.g., name or
          email)
        </p>

        <p>8.2. This information may be used to:</p>

        <p>- Maintain and improve the security, reliability, and performance of the Services</p>

        <p>- Respond to user inquiries or communications</p>

        <p>
          8.3. DiversiFi does not sell user data or track users across unrelated services. You
          remain in control of your personal information. DiversiFi will never ask for or store your
          wallet’s private keys or seed phrases.
        </p>

        <h3>
          9. <Underline>SERVICES WARRANTY; INDEMNIFICATION</Underline>
        </h3>

        <p>
          9.1.{' '}
          <strong>
            THE SERVICES ARE PROVIDED STRICTLY ON AN “AS IS” AND “AS AVAILABLE” BASIS, AND DIVERSIFI
            MAKES NO WARRANTY THAT THE SERVICES ARE COMPLETE, SUITABLE FOR YOUR PURPOSE, RELIABLE,
            USEFUL, OR ACCURATE. ON BEHALF OF ITSELF AND ITS LICENSORS, DIVERSIFI HEREBY EXPRESSLY
            DISCLAIMS ANY AND ALL IMPLIED, STATUTORY, OR OTHER WARRANTIES WITH RESPECT TO THE
            SERVICES OR THE AVAILABILITY OF THE FOREGOING, INCLUDING, WITHOUT LIMITATION, THE
            IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
            NONINFRINGEMENT. THE ENTIRE RISK AS TO RESULTS OBTAINED THROUGH USE OF THE SERVICES
            RESTS WITH YOU. DIVERSIFI AND ITS LICENSORS WILL NOT BE LIABLE OR RESPONSIBLE IN ANY WAY
            FOR ANY LOSSES OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF OR RELIANCE ON
            ANY MATERIAL CONTAINED IN THE SERVICES. FURTHERMORE, DIVERSIFI MAKES NO WARRANTIES
            REGARDING ANY THIRD-PARTY SERVICES, SOFTWARE, OR INTEGRATIONS THAT MAY BE ACCESSED
            THROUGH OR USED IN CONNECTION WITH THE SERVICES. YOU ACKNOWLEDGE AND AGREE THAT
            DIVERSIFI SHALL NOT BE RESPONSIBLE OR LIABLE FOR ANY DAMAGE OR LOSS CAUSED OR ALLEGED TO
            BE CAUSED BY OR IN CONNECTION WITH THE USE OF ANY SUCH THIRD-PARTY SERVICES, SOFTWARE,
            OR INTEGRATIONS, INCLUDING BUT NOT LIMITED TO ANY DATA LOSS, SERVICE INTERRUPTION, OR
            SECURITY ISSUES ARISING FROM SUCH USE. DIVERSIFI MAKES NO REPRESENTATION OR WARRANTY
            THAT THE AVAILABILITY OF THE SERVICES WILL BE UNINTERRUPTED, THAT THE SERVICES WILL BE
            ERROR-FREE, OR THAT ALL ERRORS WILL BE CORRECTED.
          </strong>
        </p>

        <p>
          9.2. You agree to defend, indemnify and hold harmless DiversiFi, its affiliates,
          directors, officers, employees, agents, successors and assigns (“DiversiFi Indemnified
          Parties”) against any claim, demand, suit, or proceeding, and indemnify DiversiFi
          Indemnified Parties from and against any and all losses, costs, damages, liabilities, and
          expenses (including reasonable attorneys’ fees) arising out of or related to: (i) your
          violation or alleged violation of these Terms; (ii) your use of the Services; (iii) any
          transactions you conduct using the Services; (iv) your violation of any applicable law,
          regulation, or third- party rights; or (v) any dispute between you and any other user or
          third party.
        </p>

        <h3>
          10. <Underline>LIMITATION OF LIABILITY</Underline>
        </h3>

        <p>
          10.1.{' '}
          <strong>
            EXCEPT AS PROHIBITED BY APPLICABLE LAW, IN NO EVENT WILL (A) DIVERSIFI BE LIABLE TO
            CUSTOMER OR ANY THIRD PARTY FOR ANY INDIRECT, SPECIAL, INCIDENTAL, EXEMPLARY, PUNITIVE
            OR CONSEQUENTIAL DAMAGES OF ANY KIND (INCLUDING, WITHOUT LIMITATION, TRADING LOSSES,
            LOST PROFITS, LOST DATA OR BUSINESS INTERRUPTION), ARISING OUT OF OR RELATED TO THESE
            TERMS, THE SERVICES, OR THE ASSOCIATED DATA, (B) DIVERSIFI’S TOTAL LIABILITY ARISING OUT
            OF OR RELATED TO THIS AGREEMENT EXCEED THE TOTAL AMOUNT PAID TO DIVERSIFI IN THE
            12-MONTH PERIOD IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE FIRST CLAIM (AS
            DEFINED HEREIN), OR (C)DIVERSIFI’S TOTAL LIABILITY ARISING OUT OF OR RELATED TO ANY
            PARTICULAR SERVICES EXCEED THE TOTAL AMOUNT PAID TO DIVERSIFI IN THE 12- MONTH PERIOD
            PRECEDING THE EVENT GIVING RISE TO THE FIRST CLAIM RELATED TO SUCH SERVICES.
          </strong>
        </p>

        <p>
          <strong>
            THIS DISCLAIMER AND EXCLUSION WILL APPLY EVEN IF ANY EXPRESS WARRANTY FAILS OF ITS
            ESSENTIAL PURPOSE.
          </strong>
        </p>

        <p>
          10.2. The parties agree that the waivers and limitations specified in this Section 10
          apply regardless of the form of action, whether in contract, tort (including negligence),
          strict liability, or otherwise and will survive and apply even if any limited remedy
          specified in these Terms is found to have failed of its essential purpose.
        </p>

        <h3>
          11. <Underline>MODIFICATIONS TO TERMS</Underline>
        </h3>

        <p>
          11.1. DiversiFi may revise these Terms from time to time by posting a modified version of
          the Terms including their effective date. By continuing to access or use the Services
          after the effective date of any modified Terms, you agree to be bound by such modified
          Terms.
        </p>

        <h3>
          12. <Underline>GOVERNING LAW AND JURISDICTION</Underline>
        </h3>

        <p>
          12.1. These Terms and any disputes arising out of or in connection with them shall be
          governed by and construed in accordance with the laws of the Cayman Islands, without
          regard to its conflict of law principles.
        </p>

        <p>
          12.2. Any dispute, controversy, or claim arising out of or relating to these Terms,
          including the validity, invalidity, breach, or termination thereof, shall be resolved by
          arbitration in accordance with the Arbitration Rules of the Cayman Islands Chamber of
          Commerce, which are deemed to be incorporated by reference into this clause. The number of
          arbitrators shall be one. The seat, or legal place, of arbitration shall be the Cayman
          Islands. The arbitration proceedings shall be conducted in English. The arbitration shall
          be conducted by video conference, unless the parties mutually agree otherwise. The
          decision of the arbitrator shall be final and binding on both parties.
        </p>
      </div>
    </SingleColumnLayout>
  );
}

const legalStyles = cn(
  'mx-auto max-w-[54rem]',
  'text-foreground text-justify',
  '[&_a]:text-primary [&_a]:underline',
  '[&_p]:text-sm [&_p]:leading-6 [&_p]:mb-8 [&_p]:font-normal',
  '[&_p>ul]:list-none [&_p>ul]:pl-4 [&_p>ul]:my-4',
  '[&_p>ul>li]:before:content-["("_counter(list-item)_")_"] [&_p>ul>li]:counter-increment-list-item',
  '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4',
  '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-4',
  '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-4',
  '[&_h4]:text-base [&_h4]:font-bold [&_h4]:mb-4',
  '[&_h5]:text-sm [&_h5]:font-bold [&_h5]:mb-4',
  '[&_h6]:text-xs [&_h6]:font-bold [&_h6]:mb-4'
);

const Underline = ({ children }: { children: React.ReactNode }) => {
  return <span className="underline">{children}</span>;
};
