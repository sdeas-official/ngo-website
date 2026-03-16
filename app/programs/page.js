import {
  GraduationCap,
  Heart,
  Users,
  Shield,
  Flame,
  BookOpen,
  Check,
} from "lucide-react";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { TextHighlight } from "../components/TextHighlight";
import { Button } from "../components/Button";

const specialPrograms = [
  {
    icon: Flame,
    title: "Fire & Safety Awareness",
    desc: "Comprehensive fire safety training and awareness programs for industries, schools, and communities.",
  },
  {
    icon: Shield,
    title: "Disaster Management",
    desc: "Preparedness, response, and recovery training to build resilient communities capable of handling emergencies.",
  },
  {
    icon: BookOpen,
    title: "CSR Collaborative Programs",
    desc: "Partnership initiatives with corporate entities aligned to measurable and high-impact community goals.",
  },
];

export default function Programs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative isolate overflow-hidden">
        <div className="relative flex min-h-[56vh] w-full items-center md:min-h-[62vh] xl:min-h-[66vh]">
          <img
            src="https://images.unsplash.com/photo-1759756480941-7230dedf5fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400"
            alt="Training program"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#14532d66]" />
          <div className="relative z-10 mx-auto w-full max-w-350 px-4 py-20 md:px-8 lg:px-10">
            <p className="text-sm font-semibold tracking-[0.25em] text-[#dcfce7] uppercase">
              Our Programs
            </p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Skills, Health & Community
              <br />
              <span className="text-[#d1fae5]">Transformation at Scale</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base text-white/90 md:text-xl">
              Comprehensive initiatives designed to empower communities and
              create lasting impact through education, healthcare and
              sustainable development.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 xl:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-8 px-4 md:px-8 lg:grid-cols-2 lg:gap-12 xl:gap-14 lg:px-10">
          <div className="order-1 lg:hidden">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#63c37a1f] text-[#63c37a]">
              <GraduationCap size={24} />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#1d2238] sm:text-4xl">
              <TextHighlight>Education</TextHighlight> & Skill Development
            </h2>
          </div>
          <div className="order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1759756480941-7230dedf5fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
              alt="Industrial Training"
              className="h-64 w-full rounded-3xl object-cover shadow-[0_12px_40px_rgba(15,23,42,0.18)] sm:h-80 lg:h-90 xl:h-100"
            />
          </div>
          <div className="order-3 lg:order-2">
            <div className="mb-6 hidden lg:inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#63c37a1f] text-[#63c37a]">
              <GraduationCap size={30} />
            </div>
            <h2 className="hidden lg:block font-serif text-4xl font-bold text-[#1d2238] md:text-5xl">
              <TextHighlight>Education</TextHighlight> & Skill Development
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#5f6879] md:text-lg">
              Our flagship program bridges the gap between education and
              industry requirements through focused technical training and
              employer partnerships.
            </p>
            <div className="mt-6 rounded-3xl bg-[#f0fdf4] p-6 md:p-7">
              <h4 className="font-serif text-2xl font-bold text-[#1d2238]">
                Industrial Boiler Operation Training
              </h4>
              <ul className="mt-5 space-y-3 text-[#4b5563]">
                {[
                  "4,000+ students successfully trained",
                  "99% placement rate with leading industries",
                  "Industry-certified curriculum and hands-on training",
                  "Job placement assistance and career guidance",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 text-[#63c37a]" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 flex justify-center lg:justify-start">
              <Button to="/contact">Enroll Now</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7fdf8] py-14 md:py-20 xl:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-8 px-4 md:px-8 lg:grid-cols-2 lg:gap-12 xl:gap-14 lg:px-10">
          <div className="order-1 lg:hidden">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#63c37a1f] text-[#63c37a]">
              <Heart size={24} />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#1d2238] sm:text-4xl">
              Healthcare & Awareness Camps
            </h2>
          </div>

          <div className="order-2 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1603540879030-cf3ef7505a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
              alt="Healthcare Camp"
              className="h-64 w-full rounded-3xl object-cover shadow-[0_12px_40px_rgba(15,23,42,0.18)] sm:h-80 lg:h-90 xl:h-100"
            />
          </div>

          <div className="order-3 lg:order-1">
            <div className="mb-6 hidden lg:inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#63c37a1f] text-[#63c37a]">
              <Heart size={30} />
            </div>
            <h2 className="hidden lg:block font-serif text-4xl font-bold text-[#1d2238] md:text-5xl">
              Healthcare & Awareness Camps
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#5f6879] md:text-lg">
              We organize free medical camps and awareness drives in underserved
              communities, delivering essential healthcare support where it is
              needed most.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(17,24,39,0.07)]">
                <div className="font-serif text-3xl font-extrabold text-[#63c37a]">
                  10,000+
                </div>
                <div className="mt-1 text-sm text-[#5f6879]">Beneficiaries</div>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(17,24,39,0.07)]">
                <div className="font-serif text-3xl font-extrabold text-[#63c37a]">
                  50+
                </div>
                <div className="mt-1 text-sm text-[#5f6879]">Medical Camps</div>
              </div>
            </div>
            <div className="mt-8 flex justify-center lg:justify-start">
              <Button to="/contact">Request a Health Camp</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 xl:py-24">
        <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-8 px-4 md:px-8 lg:grid-cols-2 lg:gap-12 xl:gap-14 lg:px-10">
          <div className="order-1 lg:hidden">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#63c37a1f] text-[#63c37a]">
              <Users size={24} />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#1d2238] sm:text-4xl">
              Community Development Programs
            </h2>
          </div>
          <div className="order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1759738098462-90ffac98c554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
              alt="Community Development"
              className="h-64 w-full rounded-3xl object-cover shadow-[0_12px_40px_rgba(15,23,42,0.18)] sm:h-80 lg:h-90 xl:h-100"
            />
          </div>
          <div className="order-3 lg:order-2">
            <div className="mb-6 hidden lg:inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#63c37a1f] text-[#63c37a]">
              <Users size={30} />
            </div>
            <h2 className="hidden lg:block font-serif text-4xl font-bold text-[#1d2238] md:text-5xl">
              Community Development Programs
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#5f6879] md:text-lg">
              Empowering rural communities through sustainable livelihoods,
              entrepreneurship support, and holistic local development.
            </p>

            <div className="mt-6 space-y-4">
              {[
                {
                  title: "Rural Livelihood Support",
                  desc: "Training in agriculture, animal husbandry, and crafts to improve household incomes.",
                },
                {
                  title: "Women Empowerment",
                  desc: "Skill development and entrepreneurship programs designed for women in rural areas.",
                },
                {
                  title: "Infrastructure Development",
                  desc: "Support for education facilities, water access, and essential community infrastructure.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-[#f7fdf8] p-5">
                  <h4 className="font-semibold text-[#1d2238]">{item.title}</h4>
                  <p className="mt-1.5 text-sm text-[#5f6879]">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center lg:justify-start">
              <Button to="/get-involved">Support Our Work</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f0fdf4] py-16 md:py-24">
        <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
          <div className="text-center">
            <h2 className="font-serif text-4xl font-bold text-[#1d2238] md:text-6xl">
              Special Programs & Initiatives
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[#5f6879] md:text-lg">
              Targeted interventions addressing safety, preparedness, and
              partnership-driven social impact.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {specialPrograms.map((program) => {
              const Icon = program.icon;
              return (
                <div
                  key={program.title}
                  className="rounded-3xl border border-[#63c37a1f] bg-white p-7 shadow-[0_6px_24px_rgba(17,24,39,0.08)]"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#63c37a1a] text-[#63c37a]">
                    <Icon size={24} />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#1d2238]">
                    {program.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#5f6879]">
                    {program.desc}
                  </p>
                  <div className="mt-6 flex justify-center">
                    <Button to="/contact" size="sm">
                      Learn More →
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#63c37a] py-16 md:py-24">
        <div className="mx-auto w-full max-w-350 px-4 text-center md:px-8 lg:px-10">
          <h2 className="font-serif text-4xl font-bold text-white md:text-6xl">
            Ready to Make a Difference?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base text-white/90 md:text-xl">
            Join our programs as a participant, volunteer, or partner
            organization. Together, we can create lasting change in communities
            across India.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button to="/get-involved" variant="secondary" size="lg">
              Get Involved
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#1d2238]"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
