import ContactForm from "./ContactForm";

export default function ContactBar() {
  return (
    <section
      id="contacto"
      data-hero-contact
      className="mx-auto w-full max-w-2xl scroll-mt-28 px-4 pb-20"
      aria-labelledby="contacto-heading"
    >
      <ContactForm />
    </section>
  );
}
