const Income = require("../models/Income");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

// conditional
const getIncome = async (req, res) => {
  const { incomeType } = req.query;

  const income = await Income.find();

  if (!income) {
    throw new BadRequestError(`Error in getting income. Try again later.`);
  }

  if (incomeType === "thisDay") {
    const thisDay = income.thisDay;

    res.status(StatusCodes.OK).json(thisDay);

    return;
  } else if (incomeType === "thisWeek") {
    const thisWeek = income.thisWeek;

    res.status(StatusCodes.OK).json(thisWeek);

    return;
  } else if (incomeType === "thisMonth") {
    const thisMonth = income.thisMonth;

    res.status(StatusCodes.OK).json(thisMonth);

    return;
  } else if (incomeType === "all") {
    res.status(StatusCodes.OK).json(income);

    return;
  } else {
    throw new BadRequestError(`This type of income request is not valid.`);
  }
};

const updateIncome = async (req, res) => {
  const { price } = req.body;

  const income = await Income.updateOne({ thisDay }, { $inc: { thisDay: price } });

  if (!income) {
    throw new BadRequestError(`Error in getting income. Try again later.`);
  }

  res.status(StatusCodes.OK).json(income);
};

module.exports = { getIncome, updateIncome };
