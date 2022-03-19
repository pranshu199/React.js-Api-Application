import React from "react";

class CalcUtils extends React.Component {

    static getAverage(grades) {
        let totalGradesSum = 0;
        let totalGradesCount = grades.length;
        for (let i = 0; i < grades.length; i++) {
            totalGradesSum += parseInt(grades[i]);
        }

        return totalGradesSum / totalGradesCount;
    } 
}

export default CalcUtils;