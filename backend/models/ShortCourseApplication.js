module.exports = (sequelize, DataTypes) => {
    const ShortCourseApplication = sequelize.define('ShortCourseApplication', {
        // Section 1: Personal Information
        firstName: { type: DataTypes.STRING, allowNull: false },
        middleName: { type: DataTypes.STRING, allowNull: true },
        lastName: { type: DataTypes.STRING, allowNull: false },
        gender: { type: DataTypes.ENUM('Male', 'Female', 'Other'), allowNull: false },
        dob: { type: DataTypes.DATEONLY, allowNull: false },
        citizenship: { type: DataTypes.STRING, allowNull: false },
        nationalId: { type: DataTypes.STRING, allowNull: true },
        idUpload: { type: DataTypes.STRING, allowNull: true }, // file path

        // Section 1: Contact Information
        mobile: { type: DataTypes.STRING, allowNull: false },
        altMobile: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: false },

        // Section 2: Emergency Contact
        kinName: { type: DataTypes.STRING, allowNull: false },
        kinRelationship: { type: DataTypes.STRING, allowNull: false },
        kinPhone: { type: DataTypes.STRING, allowNull: false },
        kinEmail: { type: DataTypes.STRING, allowNull: true },

        // Section 4: Course Details
        programmeLevel: { type: DataTypes.STRING, allowNull: false },
        studyMode: { type: DataTypes.STRING, allowNull: false },

        // Section 5: Academic Background
        educationLevel: { type: DataTypes.STRING, allowNull: false },
        academicFiles: { type: DataTypes.JSON, allowNull: true }, // store multiple file paths

        // Section 9: Declaration & Consent
        declarationConfirmed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        dataConsent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        signature: { type: DataTypes.STRING, allowNull: false },
    });

    return ShortCourseApplication;
};
