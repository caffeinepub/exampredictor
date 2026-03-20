import Map "mo:core/Map";
import Array "mo:base/Array";

actor {
  type Ratings = {
    luck : Nat;
    happiness : Nat;
    love : Nat;
    good : Nat;
    overall : Nat;
  };

  type ZodiacSign = Nat;

  // Keep old stable variable to satisfy upgrade compatibility — migrated in postupgrade
  stable var zodiacSigns = Map.empty<ZodiacSign, { quotation : ?Text; ratings : ?Ratings }>();

  // New stable storage: 12 slots indexed by zodiac sign
  stable var quotations : [var ?Text] = [var null, null, null, null, null, null, null, null, null, null, null, null];
  stable var ratingsStore : [var ?Ratings] = [var null, null, null, null, null, null, null, null, null, null, null, null];

  // Migrate old data from previous non-stable Map into new stable arrays
  system func postupgrade() {
    for ((sign, data) in zodiacSigns.entries()) {
      if (sign < 12) {
        switch (data.quotation) {
          case (null) {};
          case (?q) { quotations[sign] := ?q };
        };
        switch (data.ratings) {
          case (null) {};
          case (?r) { ratingsStore[sign] := ?r };
        };
      };
    };
    zodiacSigns := Map.empty();
  };

  public func setQuotation(zodiacSign : Nat, quotation : Text) : async () {
    assert zodiacSign < 12;
    quotations[zodiacSign] := ?quotation;
  };

  public query func getQuotation(zodiacSign : Nat) : async ?Text {
    assert zodiacSign < 12;
    quotations[zodiacSign];
  };

  public func setRatings(
    zodiacSign : Nat,
    luck : Nat,
    happiness : Nat,
    love : Nat,
    good : Nat,
    overall : Nat,
  ) : async () {
    assert zodiacSign < 12;
    assert luck >= 1 and luck <= 5;
    assert happiness >= 1 and happiness <= 5;
    assert love >= 1 and love <= 5;
    assert good >= 1 and good <= 5;
    assert overall >= 1 and overall <= 5;
    ratingsStore[zodiacSign] := ?{ luck; happiness; love; good; overall };
  };

  public query func getRatings(zodiacSign : Nat) : async ?Ratings {
    assert zodiacSign < 12;
    ratingsStore[zodiacSign];
  };

  public query func getAllQuotations() : async [(Nat, ?Text)] {
    Array.tabulate<(Nat, ?Text)>(12, func(i) { (i, quotations[i]) });
  };

  public query func getAllRatings() : async [(Nat, ?Ratings)] {
    Array.tabulate<(Nat, ?Ratings)>(12, func(i) { (i, ratingsStore[i]) });
  };
};
