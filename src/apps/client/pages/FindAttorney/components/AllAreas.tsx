import React from "react";
import { navigate } from "@reach/router";

export const AllAreas = ({ specialties }) => {
    return (
        <div className="flex-column mt-4 all-areas">
            <h2>Browse by practice areas</h2>

            <div className="flex-column">
                <div className="row mt-4">
                {!!specialties?.length && specialties.map(s => (
                <div 
                    key={`all-area-s-${s.id}`} 
                    className="col-md-6 find-search-page__skill cursor-pointer"
                    onClick={() => navigate(`/client/find/results?user__specialities=${s.id}`)}
                >
                    {s.title}
                </div>
                ))}
                </div>
            </div>
        </div>
    )
}