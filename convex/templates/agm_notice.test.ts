import { describe, it, expect } from "vitest";
import { generateAgmNoticeHtml, AgmNoticeData } from "./agm_notice";

describe("generateAgmNoticeHtml", () => {
  const validData: AgmNoticeData = {
    schemeName: "Oceanview Apartments",
    strataNumber: "SP12345",
    address: "123 Beach Road, Bondi NSW 2026",
    meetingDate: new Date("2026-03-10T00:00:00"),
    meetingTime: "7:00 PM",
    meetingLocation: "Building Common Room",
    secretaryName: "John Smith",
  };

  describe("with valid scheme data", () => {
    it("generates HTML content", () => {
      const html = generateAgmNoticeHtml(validData);
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("</html>");
    });

    it("includes scheme name and strata number", () => {
      const html = generateAgmNoticeHtml(validData);
      expect(html).toContain("Oceanview Apartments");
      expect(html).toContain("SP12345");
    });

    it("includes scheme address", () => {
      const html = generateAgmNoticeHtml(validData);
      expect(html).toContain("123 Beach Road, Bondi NSW 2026");
    });

    it("includes meeting details", () => {
      const html = generateAgmNoticeHtml(validData);
      expect(html).toContain("7:00 PM");
      expect(html).toContain("Building Common Room");
      expect(html).toContain("March");
      expect(html).toContain("2026");
    });

    it("includes secretary name", () => {
      const html = generateAgmNoticeHtml(validData);
      expect(html).toContain("John Smith");
    });
  });

  describe("mandatory statutory motions (SSMA 2015)", () => {
    it("includes Motion 1: Confirmation of Minutes", () => {
      const html = generateAgmNoticeHtml(validData);
      expect(html).toContain("Motion 1: Confirmation of Minutes");
      expect(html).toContain("minutes of the last Annual General Meeting");
    });

    it("includes Motion 2: Adoption of Financial Statements", () => {
      const html = generateAgmNoticeHtml(validData);
      expect(html).toContain("Motion 2: Adoption of Financial Statements");
      expect(html).toContain("Financial Statements");
    });

    it("includes Motion 3: Capital Works Fund Plan", () => {
      const html = generateAgmNoticeHtml(validData);
      expect(html).toContain("Motion 3: Capital Works Fund Plan");
      expect(html).toContain("10-year Capital Works Fund Plan");
    });

    it("includes Motion 4: Election of Strata Committee", () => {
      const html = generateAgmNoticeHtml(validData);
      expect(html).toContain("Motion 4: Election of Strata Committee");
      expect(html).toContain("elect members of the Strata Committee");
    });
  });

  describe("proxy statement", () => {
    it("includes proxy voting section", () => {
      const html = generateAgmNoticeHtml(validData);
      expect(html).toContain("VOTING BY PROXY");
      expect(html).toContain("appoint a proxy");
    });

    it("calculates proxy deadline as 24 hours before AGM", () => {
      const html = generateAgmNoticeHtml(validData);
      // AGM is 10 March 2026, proxy deadline should be 9 March 2026
      expect(html).toContain("9 March 2026");
      expect(html).toContain("Proxy Deadline");
    });
  });

  describe("without optional fields", () => {
    it("handles missing secretary name", () => {
      const dataWithoutSecretary: AgmNoticeData = {
        ...validData,
        secretaryName: undefined,
      };
      const html = generateAgmNoticeHtml(dataWithoutSecretary);
      expect(html).toContain("Secretary");
      expect(html).not.toContain("John Smith");
    });

    it("handles empty address", () => {
      const dataWithoutAddress: AgmNoticeData = {
        ...validData,
        address: "",
      };
      const html = generateAgmNoticeHtml(dataWithoutAddress);
      expect(html).toContain("Oceanview Apartments");
    });
  });

  describe("HTML escaping (security)", () => {
    it("escapes HTML special characters in scheme name", () => {
      const dataWithSpecialChars: AgmNoticeData = {
        ...validData,
        schemeName: "<script>alert('xss')</script>",
      };
      const html = generateAgmNoticeHtml(dataWithSpecialChars);
      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
    });

    it("escapes ampersands in address", () => {
      const dataWithAmpersand: AgmNoticeData = {
        ...validData,
        address: "Smith & Jones Building",
      };
      const html = generateAgmNoticeHtml(dataWithAmpersand);
      expect(html).toContain("Smith &amp; Jones Building");
    });
  });

  describe("disclaimer", () => {
    it("includes legal disclaimer", () => {
      const html = generateAgmNoticeHtml(validData);
      expect(html).toContain("Disclaimer");
      expect(html).toContain("does not constitute legal advice");
    });
  });
});
