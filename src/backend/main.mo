import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

actor {
  type ZodiacSign = Nat;

  let zodiacSigns = Map.empty<ZodiacSign, { quotation : ?Text; ratings : ?Ratings }>();

  type Ratings = {
    luck : Nat;
    happiness : Nat;
    love : Nat;
    good : Nat;
    overall : Nat;
  };

  public func setQuotation(zodiacSign : ZodiacSign, quotation : Text) : async () {
    if (zodiacSign > 11) { Runtime.trap("Invalid zodiac sign index") };
    let existingEntry = zodiacSigns.get(zodiacSign);
    let updatedEntry = {
      quotation = ?quotation;
      ratings = switch (existingEntry) { case (null) { null }; case (?data) { data.ratings } };
    };
    zodiacSigns.add(zodiacSign, updatedEntry);
  };

  public query func getQuotation(zodiacSign : ZodiacSign) : async ?Text {
    if (zodiacSign > 11) { Runtime.trap("Invalid zodiac sign index") };
    switch (zodiacSigns.get(zodiacSign)) {
      case (null) { null };
      case (?data) { data.quotation };
    };
  };

  public func setRatings(
    zodiacSign : ZodiacSign,
    luck : Nat,
    happiness : Nat,
    love : Nat,
    good : Nat,
    overall : Nat,
  ) : async () {
    if (zodiacSign > 11) { Runtime.trap("Invalid zodiac sign index") };
    if (
      luck < 1 or luck > 5 or happiness < 1 or happiness > 5 or love < 1 or love > 5 or good < 1 or good > 5 or overall < 1 or overall > 5
    ) {
      Runtime.trap("Ratings values should be between 1 and 5");
    };
    let newRatings = {
      luck;
      happiness;
      love;
      good;
      overall;
    };
    let existingEntry = zodiacSigns.get(zodiacSign);
    let updatedEntry = {
      quotation = switch (existingEntry) { case (null) { null }; case (?data) { data.quotation } };
      ratings = ?newRatings;
    };
    zodiacSigns.add(zodiacSign, updatedEntry);
  };

  public query func getRatings(zodiacSign : ZodiacSign) : async ?Ratings {
    if (zodiacSign > 11) { Runtime.trap("Invalid zodiac sign index") };
    switch (zodiacSigns.get(zodiacSign)) {
      case (null) { null };
      case (?data) { data.ratings };
    };
  };

  public query func getAllQuotations() : async [(ZodiacSign, ?Text)] {
    zodiacSigns.entries().toArray().map(
      func((sign, data)) { (sign, data.quotation) }
    );
  };

  public query func getAllRatings() : async [(ZodiacSign, ?Ratings)] {
    zodiacSigns.entries().toArray().map(
      func((sign, data)) { (sign, data.ratings) }
    );
  };
};
