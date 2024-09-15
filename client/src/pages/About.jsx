import { FaHandsHelping, FaBullseye, FaUsers } from "react-icons/fa";
import Footer from "../components/Footer"; // Adjust the import path based on your project structure

export default function About() {
  return (
    <div className="bg-grayLight min-h-screen flex flex-col justify-between">
      <div className="py-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-20 text-center text-brandBlue">
          About Awab Properties
        </h1>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col items-center bg-white shadow-lg p-6 rounded-lg">
            <FaHandsHelping className="text-brandBlue text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Exceptional Service</h3>
            <p className="text-gray-600 text-center">
              Our team of experienced agents is dedicated to providing
              exceptional service, ensuring a smooth buying and selling process
              in every transaction.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white shadow-lg p-6 rounded-lg">
            <FaBullseye className="text-brandBlue text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-600 text-center">
              We aim to help our clients achieve their real estate goals by
              offering personalized service and expert advice, tailored to the
              local market.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white shadow-lg p-6 rounded-lg">
            <FaUsers className="text-brandBlue text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Experienced Agents</h3>
            <p className="text-gray-600 text-center">
              Our team has extensive knowledge in the real estate industry,
              ensuring that every client's buying or selling journey is exciting
              and rewarding.
            </p>
          </div>
        </div>
        <div className="bg-gray-100 p-8 rounded-lg">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Awab Properties is a leading real estate agency specializing in
            helping clients buy, sell, and rent properties in the most desirable
            neighborhoods. Our team of experienced agents is dedicated to
            providing exceptional service and ensuring that the buying and
            selling process is as smooth as possible.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Our mission is to help our clients achieve their real estate goals
            by providing expert advice, personalized service, and a deep
            understanding of the local market. Whether you are looking to buy,
            sell, or rent a property, we are here to assist you every step of
            the way.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our team of agents has a wealth of experience and knowledge in the
            real estate industry, and we are committed to providing the highest
            level of service to our clients. We believe that buying or selling a
            property should be an exciting and rewarding experience, and we are
            dedicated to making that a reality for every one of our clients.
          </p>
        </div>
      </div>
      <Footer /> {/* Adding the footer component here */}
    </div>
  );
}
